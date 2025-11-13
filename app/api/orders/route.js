import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// POST orders for a user
export async function POST(request) {
    try {
        const { userId, has } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const { addressId, items, couponCode, paymentMethod } = await request.json();

        // Validate basic data
        if (!addressId || !paymentMethod || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Missing order details" }, { status: 400 });
        }

        // Validate coupon
        let coupon = null;
        if (couponCode) {
            coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found" }, { status: 400 });
            }
        }

        // Coupon restrictions
        const userOrders = await prisma.order.count({ where: { userId } });
        if (coupon?.forNewUser && userOrders > 0) {
            return NextResponse.json({ error: "Coupon valid for new users only" }, { status: 400 });
        }

        const isPlusMember = has({ plan: "plus" });
        if (coupon?.forMember && !isPlusMember) {
            return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 });
        }

        // Group items by store
        const ordersByStore = new Map();
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id },
                select: { storeId: true, price: true, name: true, images: true },
            });

            if (!product) {
                return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
            }

            const storeId = product.storeId;
            if (!ordersByStore.has(storeId)) ordersByStore.set(storeId, []);
            ordersByStore.get(storeId).push({ ...item, ...product });
        }

        const orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false;

        // Single transaction for all orders
        await prisma.$transaction(
            async (tx) => {
                for (const [storeId, sellerItems] of ordersByStore.entries()) {
                    let total = sellerItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

                    // Apply coupon
                    if (coupon) total -= (total * coupon.discount) / 100;

                    // One-time shipping fee for non-members
                    if (!isPlusMember && !isShippingFeeAdded) {
                        total += 5;
                        isShippingFeeAdded = true;
                    }

                    total = parseFloat(total.toFixed(2));
                    fullAmount += total;

                    // Create order with order items
                    const order = await tx.order.create({
                        data: {
                            userId,
                            storeId,
                            addressId,
                            total,
                            paymentMethod,
                            isCouponUsed: !!coupon,
                            coupon: coupon || {},
                            orderItems: {
                                create: sellerItems.map((item) => ({
                                    productId: item.id,
                                    quantity: item.quantity,
                                    price: item.price,
                                })),
                            },
                        },
                    });
                    orderIds.push(order.id);

                    // Fast stock update using decrement + Promise.all
                    await Promise.all(
                        sellerItems.map((item) =>
                            tx.product.update({
                                where: { id: item.id },
                                data: { stockQuantity: { decrement: item.quantity } },
                            })
                        )
                    );
                }
            },
            { timeout: 20000 } // 20s timeout to prevent P2028
        );

        // Stripe Payment Flow
        if (paymentMethod === "STRIPE") {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const origin = request.headers.get("origin");

            const allItems = Array.from(ordersByStore.values()).flat();

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: allItems.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name || `Product ${item.id}`,
                            images: item.images?.length ? [item.images[0]] : [],
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })),
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
                mode: "payment",
                success_url: `${origin}/payment-success`,
                cancel_url: `${origin}/payment-failed`,
                metadata: {
                    orderIds: orderIds.join(","),
                    userId,
                    appId: "gocart",
                },
            });

            return NextResponse.json({ session, orderIds });
        }

        // Clear user cart for COD orders
        if (paymentMethod === "COD") {
            await prisma.user.update({
                where: { id: userId },
                data: { cart: {} },
            });
        }

        return NextResponse.json({
            message: "Orders placed successfully",
            orderIds,
        });

    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );
    }
}

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId,
                OR: [
                    { paymentMethod: PaymentMethod.COD },
                    { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] },
                ],
            },
            include: {
                orderItems: { include: { product: true } },
                address: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}