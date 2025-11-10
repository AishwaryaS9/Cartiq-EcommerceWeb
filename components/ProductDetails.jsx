'use client'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react"
import Counter from "./Counter"
import { addToCart } from "@/lib/features/cart/cartSlice"

const ProductDetails = ({ product }) => {
    const productId = product.id
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"

    const cart = useSelector((state) => state.cart.cartItems)
    const dispatch = useDispatch()
    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0])

    const addToCartHandler = () => dispatch(addToCart({ productId }))

    const averageRating =
        product.rating.reduce((acc, item) => acc + item.rating, 0) /
        product.rating.length

    const discountPercent = ((product.mrp - product.price) / product.mrp) * 100

    return (
        <section
            className="flex max-lg:flex-col gap-10 lg:gap-14 mt-8"
            aria-label={`Product details for ${product.name}`}
        >
            {/* LEFT SECTION - IMAGES */}
            <div
                className="flex max-sm:flex-col-reverse gap-4"
                aria-label="Product image gallery"
            >
                {/* Thumbnail list */}
                <div
                    className="flex sm:flex-col gap-3"
                    role="list"
                    aria-label="Product image thumbnails"
                >
                    {product.images.map((image, index) => (
                        <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMainImage(image)}
                            className={`flex items-center justify-center size-24 sm:size-20 cursor-pointer rounded-xl border-1 transition-all duration-300 ${mainImage === image
                                ? "border-primary bg-slate-50"
                                : "border-gray-200 bg-slate-50"
                                }`}
                            aria-label={`View product image ${index + 1}`}
                            role="listitem"
                        >
                            <Image
                                src={image}
                                alt={`${product.name} image ${index + 1}`}
                                width={60}
                                height={60}
                                className="object-contain"
                            />
                        </motion.button>
                    ))}
                </div>

                {/* Main image */}
                <motion.div
                    key={mainImage}
                    initial={{ opacity: 0.3, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center w-full sm:w-[460px] h-[460px] bg-slate-100 rounded-2xl shadow-inner"
                    aria-label="Main product image"
                >
                    <Image
                        src={mainImage}
                        alt={`${product.name} main view`}
                        width={350}
                        height={350}
                        className="object-contain"
                        priority
                    />
                </motion.div>
            </div>

            {/* RIGHT SECTION - DETAILS */}
            <div className="flex-1" aria-labelledby="product-title">
                {/* Product name */}
                <h1
                    id="product-title"
                    className="text-2xl sm:text-3xl font-medium text-slate-600 leading-tight mb-2"
                >
                    {product.name}
                </h1>

                {/* Rating */}
                <div
                    className="flex items-center mt-3"
                    aria-label={`Average rating ${averageRating.toFixed(
                        1
                    )} out of 5 based on ${product.rating.length} reviews`}
                >
                    {Array(5)
                        .fill("")
                        .map((_, index) => (
                            <StarIcon
                                key={index}
                                size={18}
                                className="text-transparent mt-0.5"
                                fill={
                                    averageRating >= index + 1
                                        ? "#FFC107"
                                        : "#E5E7EB"
                                }
                                aria-hidden="true"
                            />
                        ))}
                    <p className="text-sm ml-3 text-slate-500">
                        {product.rating.length} Reviews
                    </p>
                </div>

                {/* Price */}
                <div
                    className="flex items-baseline gap-4 my-6"
                    aria-label={`Price ${currency}${product.price}. Original price ${currency}${product.mrp}`}
                >
                    <p
                        className="text-3xl font-semibold text-primary"
                        aria-label={`Current price ${currency}${product.price}`}
                    >
                        {currency}
                        {product.price}
                    </p>
                    <p
                        className="text-xl text-slate-400 line-through"
                        aria-label={`Original price ${currency}${product.mrp}`}
                    >
                        {currency}
                        {product.mrp}
                    </p>
                </div>

                {/* Discount Info */}
                <div
                    className="flex items-center gap-2 text-slate-500"
                    aria-label={`You save ${discountPercent.toFixed(0)} percent`}
                >
                    <TagIcon size={16} aria-hidden="true" />
                    <p className="text-sm">
                        Save{" "}
                        <span className="font-medium text-primary">
                            {discountPercent.toFixed(0)}%
                        </span>{" "}
                        right now
                    </p>
                </div>

                {/* Cart Section */}
                <div
                    className="flex items-end flex-wrap gap-6 mt-10"
                    aria-label="Add to cart or update quantity"
                >
                    {cart[productId] && (
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor={`quantity-${productId}`}
                                className="text-base text-slate-700 font-medium"
                            >
                                Quantity
                            </label>
                            <Counter
                                productId={productId}
                                id={`quantity-${productId}`}
                            />
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            !cart[productId]
                                ? addToCartHandler()
                                : router.push("/cart")
                        }
                        className="bg-primary text-white px-8 sm:px-10 py-3 text-sm font-medium rounded-full shadow-md hover:bg-primary/85 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        aria-label={
                            !cart[productId]
                                ? "Add this product to your cart"
                                : "View your shopping cart"
                        }
                    >
                        {!cart[productId] ? "Add to Cart" : "View Cart"}
                    </motion.button>
                </div>

                <hr
                    className="border-gray-200 my-8"
                    role="separator"
                    aria-hidden="true"
                />

                {/* Assurance Section */}
                <div
                    className="flex flex-col gap-3 text-slate-600"
                    aria-label="Purchase assurances"
                >
                    <p className="flex gap-3 items-center">
                        <EarthIcon
                            className="text-primary"
                            size={18}
                            aria-hidden="true"
                        />
                        <span>Free worldwide shipping</span>
                    </p>
                    <p className="flex gap-3 items-center">
                        <CreditCardIcon
                            className="text-primary"
                            size={18}
                            aria-hidden="true"
                        />
                        <span>100% secure payment</span>
                    </p>
                    <p className="flex gap-3 items-center">
                        <UserIcon
                            className="text-primary"
                            size={18}
                            aria-hidden="true"
                        />
                        <span>Trusted by top brands</span>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails
