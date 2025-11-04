'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import SkeletonLoading from './SkeletonLoading'

const BestSelling = () => {
    const displayQuantity = 8
    const products = useSelector(state => state.product.list)
    const isLoading = !products || products.length === 0

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title
                title='Best Selling'
                description={
                    isLoading
                        ? 'Loading products...'
                        : `Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`
                }
                href='/shop'
            />
            {isLoading ? (
                <SkeletonLoading displayQuantity={displayQuantity} />
            ) : (
                <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                    {products
                        .slice()
                        .sort((a, b) => b.rating.length - a.rating.length)
                        .slice(0, displayQuantity)
                        .map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                </div>
            )}
        </div>
    )
}

export default BestSelling
