'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import SkeletonLoading from "@/components/SkeletonLoading"

function ShopContent() {

    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)
    const isLoading = !products || products.length === 0

    const filteredProducts = search
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products

    const noResults = !isLoading && filteredProducts.length === 0

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl font-medium text-primary my-6 flex items-center gap-2 cursor-pointer"
                >
                    {search && <MoveLeftIcon size={20} />}
                    All <span className="text-slate-700 font-medium">Products</span>
                </h1>

                {isLoading ? (
                    <SkeletonLoading displayQuantity={8} />
                ) : noResults ? (
                    <div className="text-center text-slate-600 py-16">
                        <p className="text-lg">
                            No products found{search ? ` for "${search}"` : ''}.
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                        >
                            Back to All Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-32">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    )
}
