'use client'
import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, Heart } from 'lucide-react'
import { addToFavorites, removeFromFavorites, uploadFavorites } from '@/lib/features/favorites/favoritesSlice'

const ProductCard = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const rating =
        Math.round(
            product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
            product.rating.length
        ) || 0


    const dispatch = useDispatch()
    const { getToken } = useAuth()
    const favorites = useSelector(state => state.favorites.favoriteItems)

    const isFavorite = favorites.includes(product.id)

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite) {
            dispatch(removeFromFavorites(product.id));
        } else {
            dispatch(addToFavorites(product.id));
        }
        dispatch(uploadFavorites({ getToken }));
    };

    return (
        <Link
            href={`/product/${product.id}`}
            className='group max-xl:mx-auto block'
        >
            <div className='relative bg-secondary h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden'>
                <button
                    onClick={handleFavoriteClick}
                    className='absolute top-2 right-2 p-1 rounded-full hover:scale-110 transition-transform duration-200'
                >
                    <Heart
                        size={18}
                        onClick={handleFavoriteClick}
                        className={`absolute top-2 right-2 cursor-pointer transition-transform duration-200 hover:scale-110 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                    />
                </button>

                <Image
                    width={500}
                    height={500}
                    className='max-h-30 sm:max-h-40 w-auto group-hover:scale-110 transition duration-300'
                    src={product.images[0]}
                    alt={product.name}
                />
            </div>

            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5'
                                fill={rating >= index + 1 ? "#FFC107" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard
