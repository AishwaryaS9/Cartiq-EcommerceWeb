'use client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import ProductCard from '@/components/ProductCard'

export default function ProductsByCategories() {
    const params = useParams()
    const router = useRouter()
    const category = decodeURIComponent(params.categoryName)

    const [loading, setLoading] = useState(true)
    const [productsList, setProductsList] = useState([])
    const products = useSelector((state) => state.product.list)

    const fetchProduct = async () => {
        try {
            const product = products.filter((item) => item.category === category)
            setProductsList(product)
        } catch (error) {
            console.error('Error fetching products by category:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (category) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [category, products])

    // --- No products state ---
    if (productsList.length === 0 && !loading) {
        return (
            <main className=" items-center justify-center py-16 text-slate-700 text-center px-4"
                role="region"
                aria-label={`No products found in ${category} category`}>
                <p className="text-lg" tabIndex={0}>
                    No products found in <span className="capitalize">"{category}"</span> category.
                </p>
                <button
                    onClick={() => router.push('/shop')}
                    className="mt-6 bg-primary font-medium text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                    aria-label="Browse products in the shop">
                    Browse Products
                </button>
            </main>
        )
    }

    // --- Loading state ---
    if (loading) {
        return (
            <main
                role="main"
                aria-label="Loading products"
                className="flex items-center justify-center min-h-[70vh]"
            >
                <Loading />
            </main>
        )
    }

    // --- Product list view ---
    return (
        <main
            role="main"
            aria-label={`Products in ${category} category`}
            className="min-h-[70vh] mx-4 sm:mx-6 lg:mx-8 my-10"
        >
            {/* SEO meta tags */}
            <meta
                name="description"
                content={`Explore a wide selection of ${category} products available on Cartiq. Shop smart with curated deals and quality items.`}
            />
            <meta
                name="keywords"
                content={`Cartiq, ${category}, Online Shopping, Buy ${category}, eCommerce, Product List`}
            />
            <meta name="robots" content="index, follow" />

            <section
                aria-labelledby="category-header"
                className="max-w-7xl mx-auto"
            >
                <header
                    id="category-header"
                    className="flex items-center justify-between my-6"
                >
                    <h1
                        className="text-2xl sm:text-3xl font-semibold text-primary capitalize cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                        onClick={() => router.push('/shop')}
                        role="button"
                        tabIndex={0}
                        aria-label={`Go back to all shop categories`}
                        onKeyDown={(e) => e.key === 'Enter' && router.push('/shop')}
                    >
                        {category}
                    </h1>
                </header>

                <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-32"
                    role="region"
                    aria-label={`List of products under ${category} category`}
                >
                    {productsList.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            aria-label={`Product: ${item.name}`}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}

