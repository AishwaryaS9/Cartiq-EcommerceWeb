'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, FilterIcon, ArrowUpDownIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import SkeletonLoading from "@/components/SkeletonLoading"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)
    const isLoading = !products || products.length === 0

    const [sortBy, setSortBy] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const categories = useMemo(() => {
        const unique = new Set()
        products.forEach(p => p.category && unique.add(p.category))
        return Array.from(unique)
    }, [products])

    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter)
        }

        switch (sortBy) {
            case 'price-low-high':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-high-low':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'name-az':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'name-za':
                filtered.sort((a, b) => b.name.localeCompare(a.name))
                break
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            default:
                break
        }

        return filtered
    }, [products, search, categoryFilter, sortBy])

    const noResults = !isLoading && filteredProducts.length === 0

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

    useMemo(() => setCurrentPage(1), [search, categoryFilter, sortBy])

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

                {!isLoading && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex gap-4 items-center">
                            <label className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                <FilterIcon size={14} /> Filter by:
                            </label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 items-center">
                            <label className="text-sm text-gray-700 font-medium flex items-center gap-1">
                                <ArrowUpDownIcon size={14} /> Sort by:
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Default</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="name-az">Name: A–Z</option>
                                <option value="name-za">Name: Z–A</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>
                )}

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
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                            {paginatedProducts.map((product) => (
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

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    )
}
