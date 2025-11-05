'use client'
import { Suspense, useEffect, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import SkeletonLoading from "@/components/SkeletonLoading"
import { useAuth } from "@clerk/nextjs"
import { fetchFavorites } from "@/lib/features/favorites/favoritesSlice"

function FavoritesContent() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { getToken } = useAuth()

    const products = useSelector(state => state.product.list)
    const favoriteItems = useSelector(state => state.favorites.favoriteItems)
    const isLoading = !products || products.length === 0

    useEffect(() => {
        dispatch(fetchFavorites({ getToken }))
    }, [dispatch, getToken])

    const favoriteProducts = useMemo(() => {
        return products.filter(p => favoriteItems.includes(p.id))
    }, [products, favoriteItems])

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const totalPages = Math.ceil(favoriteProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedFavorites = favoriteProducts.slice(startIndex, startIndex + itemsPerPage)

    const noResults = !isLoading && favoriteProducts.length === 0

    useMemo(() => setCurrentPage(1), [favoriteProducts])

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl font-medium text-primary my-6 flex items-center gap-2 cursor-pointer"
                >
                    <MoveLeftIcon size={20} />
                    My <span className="text-slate-700 font-medium">Favorites</span>
                </h1>

                {isLoading ? (
                    <SkeletonLoading displayQuantity={8} />
                ) : noResults ? (
                    <div className="text-center text-slate-600 py-16">
                        <p className="text-lg">You haven't added any favorites yet.</p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {paginatedFavorites.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mb-24">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className={`px-4 py-2 rounded-md border text-sm transition ${currentPage === 1
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    ← Prev
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium border ${currentPage === i + 1
                                            ? "bg-primary text-white border-primary"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className={`px-4 py-2 rounded-md border text-sm transition ${currentPage === totalPages
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default function FavoritesPage() {
    return (
        <Suspense fallback={<div>Loading favorites...</div>}>
            <FavoritesContent />
        </Suspense>
    )
}
