'use client'
import React from 'react'
import { useSelector } from 'react-redux'
import Title from './Title'
import ProductCard from './ProductCard'
import SkeletonLoading from './SkeletonLoading'

const BestSelling = () => {
    const displayQuantity = 8
    const products = useSelector((state) => state.product.list)
    const isLoading = !products || products.length === 0

    const sortedProducts = !isLoading
        ? products
            .slice()
            .sort((a, b) => b.rating.length - a.rating.length)
            .slice(0, displayQuantity)
        : []

    return (
        <section
            className="px-6 my-10 sm:my-8 lg:my-5 max-w-6xl mx-auto"
            aria-labelledby="best-selling-title"
            role="region"
        >
            {/* Section Header */}
            <header className="mb-10">
                <Title
                    id="best-selling-title"
                    title="Best Selling"
                    description={
                        isLoading
                            ? 'Loading products...'
                            : `Showing ${products.length < displayQuantity
                                ? products.length
                                : displayQuantity
                            } of ${products.length} products`
                    }
                    href="/shop"
                />
            </header>

            {/* Content: Skeleton or Product Grid */}
            {isLoading ? (
                <div
                    role="status"
                    aria-live="polite"
                    aria-busy="true"
                    className="flex justify-center items-center min-h-[200px]"
                >
                    <SkeletonLoading displayQuantity={displayQuantity} />
                    <span className="sr-only">Loading best-selling products...</span>
                </div>
            ) : (
                <ul
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-12 justify-items-center"
                    role="list"
                    aria-label="List of best-selling products"
                >
                    {sortedProducts.map((product, index) => (
                        <li
                            key={product.id || index}
                            className="w-full max-w-[280px] sm:max-w-none"
                            aria-label={`Product: ${product.name}`}
                        >
                            <ProductCard product={product} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default BestSelling
