import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request) {
    try {
        const { userId, has } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const { addressId, items, couponCode, paymentMethod } = await request.json();

        // Validate required fields
        if (!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Missing order details" }, { status: 400 });
        }

        // Handle coupon logic
        let coupon = null;
        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found" }, { status: 400 });
            }
        }

        // Check coupon for new users
        if (couponCode && coupon.forNewUser) {
            const userOrders = await prisma.order.findMany({ where: { userId } });
            if (userOrders.length > 0) {
                return NextResponse.json({ error: "Coupon valid for new users only" }, { status: 400 });
            }
        }

        const isPlusMember = has({ plan: "plus" });

        // Check coupon for members
        if (couponCode && coupon.forMember && !isPlusMember) {
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
            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, []);
            }

            ordersByStore.get(storeId).push({
                ...item,
                price: product.price,
            });
        }

        let orderIds = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false;

        // Use a transaction for all order + stock updates
        await prisma.$transaction(async (tx) => {
            for (const [storeId, sellerItems] of ordersByStore.entries()) {
                let total = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

                // Apply coupon discount
                if (couponCode) {
                    total -= (total * coupon.discount) / 100;
                }

                // Apply one-time shipping fee for non-members
                if (!isPlusMember && !isShippingFeeAdded) {
                    total += 5;
                    isShippingFeeAdded = true;
                }

                fullAmount += parseFloat(total.toFixed(2));

                //  Create the order
                const order = await tx.order.create({
                    data: {
                        userId,
                        storeId,
                        addressId,
                        total: parseFloat(total.toFixed(2)),
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

                //  Update stock quantity for all products in this order
                for (const item of sellerItems) {
                    const product = await tx.product.findUnique({
                        where: { id: item.id },
                        select: { stockQuantity: true, inStock: true },
                    });

                    if (!product) continue;

                    const newQuantity = Math.max(product.stockQuantity - item.quantity, 0);

                    await tx.product.update({
                        where: { id: item.id },
                        data: {
                            stockQuantity: newQuantity,
                        },
                    });
                }
            }
        });

        // Stripe payment flow
        if (paymentMethod === "STRIPE") {
            const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
            const origin = await request.headers.get("origin");

            // Flatten all items from all stores into a single array
            const allItems = Array.from(ordersByStore.values()).flat();

            // Stripe checkout session with detailed line items
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: allItems.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name || `Product ${item.id}`,
                            images: item.images?.length ? [item.images[0]] : item.image ? [item.image] : [],
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })),
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
                mode: "payment",
                success_url: `${origin}/loading?nextUrl=orders`,
                cancel_url: `${origin}/cart`,
                metadata: {
                    orderIds: orderIds.join(","),
                    userId,
                    appId: "gocart",
                },
            });
            return NextResponse.json({ session });
        }


        // Clear user cart after COD order
        await prisma.user.update({
            where: { id: userId },
            data: { cart: {} },
        });

        return NextResponse.json({ message: "Orders Placed Successfully" });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// GET all orders for a user
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
