'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

    const cart = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);
    const addToCartHandler = () => dispatch(addToCart({ productId }));

    const averageRating =
        product.rating.reduce((acc, item) => acc + item.rating, 0) /
        product.rating.length;

    return (
        <div className="flex max-lg:flex-col gap-14 mt-8">
            {/* LEFT SECTION - IMAGES */}
            <div className="flex max-sm:flex-col-reverse gap-4">
                {/* Thumbnail list */}
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMainImage(image)}
                            className={`flex items-center justify-center size-24 sm:size-20 cursor-pointer rounded-xl border-1 transition-all duration-300 ${mainImage === image
                                ? "border-primary bg-green-50"
                                : "border-transparent bg-slate-100 "
                                }`}
                        >
                            <Image
                                src={image}
                                alt=""
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Main image */}
                <motion.div
                    key={mainImage}
                    initial={{ opacity: 0.3, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center w-full sm:w-[460px] h-[460px] bg-slate-100 rounded-2xl shadow-inner"
                >
                    <Image
                        src={mainImage}
                        alt={product.name}
                        width={350}
                        height={350}
                        className="object-contain"
                    />
                </motion.div>
            </div>

            {/* RIGHT SECTION - DETAILS */}
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-900 leading-tight">
                    {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mt-3">
                    {Array(5)
                        .fill("")
                        .map((_, index) => (
                            <StarIcon
                                key={index}
                                size={16}
                                className="text-transparent mt-0.5"
                                fill={averageRating >= index + 1 ? "#10B981" : "#E5E7EB"}
                            />
                        ))}
                    <p className="text-sm ml-3 text-slate-500">
                        {product.rating.length} Reviews
                    </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 my-6">
                    <p className="text-3xl font-semibold text-primary">
                        {currency}{product.price}
                    </p>
                    <p className="text-xl text-slate-400 line-through">
                        {currency}{product.mrp}
                    </p>
                </div>

                {/* Discount Info */}
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={16} />
                    <p className="text-sm">
                        Save{" "}
                        <span className="font-medium text-primary">
                            {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}%
                        </span>{" "}
                        right now
                    </p>
                </div>

                {/* Cart Section */}
                <div className="flex items-end flex-wrap gap-6 mt-10">
                    {cart[productId] && (
                        <div className="flex flex-col gap-2">
                            <p className="text-base text-slate-700 font-medium">Quantity</p>
                            <Counter productId={productId} />
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            !cart[productId] ? addToCartHandler() : router.push("/cart")
                        }
                        className="bg-primary text-white px-10 py-3 text-sm font-medium rounded-full shadow-md hover:bg-primary/80 active:scale-95 transition-all"
                    >
                        {!cart[productId] ? "Add to Cart" : "View Cart"}
                    </motion.button>
                </div>

                <hr className="border-gray-200 my-8" />

                {/* Assurance Section */}
                <div className="flex flex-col gap-3 text-slate-600">
                    <p className="flex gap-3 items-center">
                        <EarthIcon className="text-primary" size={18} /> Free worldwide
                        shipping
                    </p>
                    <p className="flex gap-3 items-center">
                        <CreditCardIcon className="text-primary" size={18} /> 100% Secure
                        Payment
                    </p>
                    <p className="flex gap-3 items-center">
                        <UserIcon className="text-primary" size={18} /> Trusted by top
                        brands
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
