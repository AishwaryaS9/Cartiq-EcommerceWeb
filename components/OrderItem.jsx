'use client'
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { DotIcon } from "lucide-react";
import Rating from "./Rating";
import RatingModal from "./RatingModal";

const OrderItem = ({ order }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const { ratings } = useSelector(state => state.rating);


    const formattedStatus = order.status
        ? order.status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
        : 'Unknown';

    return (
        <>
            <tr
                className="text-sm"
                role="row"
                aria-label={`Order placed on ${new Date(order.createdAt).toDateString()} with status ${formattedStatus}`}
            >
                {/* Product Info */}
                <td className="text-left align-top" role="cell">
                    <div className="flex flex-col gap-6" aria-label="Ordered products">
                        {order.orderItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4"
                                role="group"
                                aria-label={`Product: ${item.product.name}`}
                            >
                                <Link
                                    href={`/product/${item.product.id}`}
                                    aria-label={`View details for ${item.product.name}`}
                                >
                                    <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                        <Image
                                            className="h-14 w-auto"
                                            src={item.product.images[0]}
                                            alt={`Image of ${item.product.name}`}
                                            width={50}
                                            height={50}
                                            priority={index === 0}
                                        />
                                    </div>
                                </Link>

                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">
                                        {item.product.name}
                                    </p>
                                    <p aria-label={`Price ${currency}${item.price}, Quantity ${item.quantity}`}>
                                        {currency}{item.price} &nbsp;Qty: {item.quantity}
                                    </p>
                                    <p className="mb-1" aria-label={`Order date ${new Date(order.createdAt).toDateString()}`}>
                                        {new Date(order.createdAt).toDateString()}
                                    </p>

                                    <div>
                                        {ratings.find(
                                            rating =>
                                                order.id === rating.orderId &&
                                                item.product.id === rating.productId
                                        ) ? (
                                            <Rating
                                                value={
                                                    ratings.find(
                                                        rating =>
                                                            order.id === rating.orderId &&
                                                            item.product.id === rating.productId
                                                    ).rating
                                                }
                                            />
                                        ) : (
                                            <button
                                                onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })}
                                                className={`text-slate-600 font-normal hover:text-primary transition ${order.status !== "DELIVERED" && 'hidden'}`}
                                                aria-label={`Rate ${item.product.name}`}
                                            >
                                                Rate Product
                                            </button>
                                        )}
                                    </div>
                                    {ratingModal && (
                                        <RatingModal
                                            ratingModal={ratingModal}
                                            setRatingModal={setRatingModal}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                {/* Total Price */}
                <td
                    className="text-left max-md:hidden whitespace-nowrap w-[15%]"
                    role="cell"
                    aria-label={`Total price ${currency}${order.total}`}
                >
                    {currency}{order.total}
                </td>

                {/* Address */}
                <td className="text-left max-md:hidden" role="cell" aria-label="Delivery address">
                    <address className="not-italic text-sm leading-snug">
                        <p>{order.address.name}, {order.address.street},</p>
                        <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                        <p>{order.address.phone}</p>
                    </address>
                </td>

                {/* Order Status */}
                <td
                    className="text-left space-y-2 text-sm max-md:hidden whitespace-nowrap w-[1%]"
                    role="cell"
                    aria-label={`Order status: ${formattedStatus}`}
                >
                    <div
                        className={`inline-flex items-center bg-slate-50 font-medium justify-center gap-1 rounded-full px-4 py-2 whitespace-nowrap 
        ${order.status === "ORDER_PLACED"
                                ? "text-yellow-500"
                                : order.status === "PROCESSING"
                                    ? "text-blue-600"
                                    : order.status === "SHIPPED"
                                        ? "text-purple-600 "
                                        : order.status === "DELIVERED"
                                            ? "text-green-600 "
                                            : "text-slate-600"
                            }
    `}
                    >
                        <DotIcon size={10} className="scale-250" aria-hidden="true" />
                        <span className="capitalize">{formattedStatus}</span>
                    </div>
                </td>

            </tr>

            {/* Mobile View */}
            <tr className="md:hidden" role="row">
                <td colSpan={5} role="cell">
                    <address className="not-italic text-sm leading-snug">
                        <p>{order.address.name}, {order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                        <p>{order.address.phone}</p>
                    </address>
                    <div className="flex items-center mt-3">
                        <span
                            className={`inline-flex items-center text-xs mx-auto bg-slate-50 font-medium justify-center gap-1 rounded-full px-6 py-2  whitespace-nowrap
        ${order.status === "ORDER_PLACED"
                                    ? "text-yellow-500"
                                    : order.status === "PROCESSING"
                                        ? "text-blue-600"
                                        : order.status === "SHIPPED"
                                            ? "text-purple-600 "
                                            : order.status === "DELIVERED"
                                                ? "text-green-600 "
                                                : "text-slate-600"
                                }
    `}
                            aria-label={`Order status: ${formattedStatus}`}
                        >
                            <DotIcon size={10} className="scale-250" aria-hidden="true" />
                            {formattedStatus}
                        </span>
                    </div>
                </td>
            </tr>

            {/* Divider */}
            <tr role="presentation" aria-hidden="true">
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    );
};

export default OrderItem;
