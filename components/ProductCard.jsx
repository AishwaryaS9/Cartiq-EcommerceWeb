'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import { StarIcon, Heart } from 'lucide-react'
import { addToFavorites, removeFromFavorites, uploadFavorites } from '@/lib/features/favorites/favoritesSlice'

const ProductCard = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const rating =
        product.rating && product.rating.length > 0
            ? Math.round(
                product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length
            )
            : 0

    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const favorites = useSelector((state) => state.favorites.favoriteItems)
    const isFavorite = favorites.includes(product.id)

    const handleFavoriteClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const token = await getToken()
        if (!token) {
            toast.error('You need to log in to add items to your favorites.')
            return
        }

        if (isFavorite) {
            dispatch(removeFromFavorites(product.id))
        } else {
            dispatch(addToFavorites(product.id))
        }
        dispatch(uploadFavorites({ getToken }))
    }

    return (
        <article
            className="group relative block rounded-lg transition-shadow duration-200 w-full max-w-[200px] sm:max-w-[210px] md:max-w-[220px] xl:max-w-[230px]"
            aria-label={`Product: ${product.name}`}
        >
            <Link
                href={`/product/${product.id}`}
                className="relative bg-secondary w-full aspect-[4/5] rounded-lg flex items-center justify-center overflow-hidden focus:outline-none"
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
                    className="absolute top-2 right-2 p-1 rounded-full z-20 hover:bg-secondary transition"
                >
                    <Heart
                        size={16}
                        className={`transition-colors duration-200 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                        aria-hidden="true"
                    />
                </button>

                {/* Product Image */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        width={240}
                        height={240}
                        src={product.images?.[0] || '/placeholder.png'}
                        alt={`${product.name} - product image`}
                        className="object-contain max-h-[75%] w-auto h-auto group-hover:scale-110 transition duration-300"
                        loading="lazy"
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex justify-between items-start gap-2 text-sm text-slate-800 pt-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-normal text-slate-700 line-clamp-1 text-xs sm:text-sm" title={product.name}>
                        {product.name}
                    </h3>

                    {/* Star Rating */}
                    <div
                        className="flex items-center mt-0.5"
                        aria-label={`Rated ${rating} out of 5 stars`}
                    >
                        {Array(5)
                            .fill('')
                            .map((_, index) => (
                                <StarIcon
                                    key={index}
                                    size={12}
                                    className="text-transparent"
                                    fill={rating >= index + 1 ? '#FFC107' : '#D1D5DB'}
                                    aria-hidden="true"
                                />
                            ))}
                        <span className="sr-only">{rating} out of 5 stars</span>
                    </div>
                </div>

                {/* Product Price */}
                <p
                    className="text-xs sm:text-sm font-medium text-customBlack whitespace-nowrap"
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
