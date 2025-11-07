'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { StarIcon, Heart } from 'lucide-react'
import { addToFavorites, removeFromFavorites, uploadFavorites } from '@/lib/features/favorites/favoritesSlice'

const ProductCard = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const rating =
        product.rating && product.rating.length > 0
            ? Math.round(
                product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
                product.rating.length
            )
            : 0

    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const favorites = useSelector((state) => state.favorites.favoriteItems)
    const isFavorite = favorites.includes(product.id)

    const handleFavoriteClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (isFavorite) {
            dispatch(removeFromFavorites(product.id))
        } else {
            dispatch(addToFavorites(product.id))
        }
        dispatch(uploadFavorites({ getToken }))
    }

    return (
        <article
            className="group max-xl:mx-auto block  rounded-lg transition-shadow duration-200 "
            aria-label={`Product: ${product.name}`}
        >
            <Link
                href={`/product/${product.id}`}
                className="relative bg-secondary h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden focus:outline-none"
                aria-label={`View details for ${product.name}`}
            >
                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    type="button"
                    aria-pressed={isFavorite}
                    aria-label={
                        isFavorite
                            ? `Remove ${product.name} from favorites`
                            : `Add ${product.name} to favorites`
                    }
                    className="absolute top-2 right-2 p-1 rounded-full z-20  hover:bg-secondary transition"
                >
                    <Heart
                        size={18}
                        className={`transition-colors duration-200 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                            }`}
                        aria-hidden="true"
                    />
                </button>

                {/* Product Image */}
                <Image
                    width={500}
                    height={500}
                    className="relative z-10 max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition duration-300 object-contain"
                    src={product.images[0]}
                    alt={`${product.name} - product image`}
                    loading="lazy"
                />
            </Link>

            {/* Product Info */}
            <div className="flex justify-between items-start gap-3 text-sm text-slate-800 pt-2 max-w-60">
                <div>
                    <h3 className="font-normal text-slate-700 line-clamp-1">{product.name}</h3>

                    {/* Star Rating */}
                    <div
                        className="flex items-center"
                        aria-label={`Rated ${rating} out of 5 stars`}
                    >
                        {Array(5)
                            .fill('')
                            .map((_, index) => (
                                <StarIcon
                                    key={index}
                                    size={14}
                                    className="text-transparent mt-0.5"
                                    fill={rating >= index + 1 ? '#FFC107' : '#D1D5DB'}
                                    aria-hidden="true"
                                />
                            ))}
                        <span className="sr-only">{rating} out of 5 stars</span>
                    </div>
                </div>

                {/* Product Price */}
                <p
                    className="text-sm font-medium text-customBlack whitespace-nowrap"
                    aria-label={`Price: ${currency}${product.price}`}
                >
                    {currency}
                    {product.price}
                </p>
            </div>
        </article>
    )
}

export default ProductCard
