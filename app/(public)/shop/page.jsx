'use client'
import { Suspense, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { MoveLeftIcon, FilterIcon, ArrowUpDownIcon } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import SkeletonLoading from "@/components/SkeletonLoading"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector((state) => state.product.list)
    const isLoading = !products || products.length === 0

    const [sortBy, setSortBy] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const categories = useMemo(() => {
        const unique = new Set()
        products.forEach((p) => p.category && unique.add(p.category))
        return Array.from(unique)
    }, [products])

    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        if (search) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter((p) => p.category === categoryFilter)
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
                filtered.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
                break
            default:
                break
        }

        return filtered
    }, [products, search, categoryFilter, sortBy])

    const noResults = !isLoading && filteredProducts.length === 0
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    useMemo(() => setCurrentPage(1), [search, categoryFilter, sortBy])

    return (
        <main
            className="min-h-[70vh] mx-4 sm:mx-6 lg:mx-10"
            role="main"
            aria-label="Shop product listing page"
        >
            <div className="max-w-7xl mx-auto">
                <h1
                    onClick={() => router.push('/shop')}
                    className="text-2xl font-medium text-primary my-6 flex items-center gap-2 cursor-pointer"
                    tabIndex={0}
                    aria-label={
                        search
                            ? `Go back to all products. Current search: ${search}`
                            : "All products"
                    }
                >
                    {search && <MoveLeftIcon size={20} aria-hidden="true" />}
                    <span>All</span>{' '}
                    <span className="text-slate-700 font-medium">Products</span>
                </h1>

                {/* FILTERS + SORT */}
                {!isLoading && (
                    <section
                        className="flex flex-wrap items-center justify-between gap-4 mb-8"
                        aria-label="Product filters and sorting options"
                    >
                        {/* Filter by category */}
                        <div className="flex gap-3 sm:gap-4 items-center">
                            <label
                                htmlFor="categoryFilter"
                                className="text-sm text-gray-700 font-medium flex items-center gap-1"
                            >
                                <FilterIcon size={14} aria-hidden="true" /> Filter by:
                            </label>
                            <select
                                id="categoryFilter"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                aria-label="Filter products by category"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort by options */}
                        <div className="flex gap-3 sm:gap-4 items-center">
                            <label
                                htmlFor="sortBy"
                                className="text-sm text-gray-700 font-medium flex items-center gap-1"
                            >
                                <ArrowUpDownIcon size={14} aria-hidden="true" /> Sort by:
                            </label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                aria-label="Sort products by criteria"
                            >
                                <option value="">Default</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="name-az">Name: A-Z</option>
                                <option value="name-za">Name: Z-A</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </section>
                )}

                {/* PRODUCT GRID / STATES */}
                {isLoading ? (
                    <SkeletonLoading displayQuantity={8} aria-label="Loading products" />
                ) : noResults ? (
                    <div
                        className="text-center text-slate-600 py-16"
                        role="status"
                        aria-live="polite"
                    >
                        <p className="text-lg">
                            No products found
                            {search ? ` for “${search}”` : ''}.
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition focus:ring-1 focus:ring-primary"
                            aria-label="Back to all products"
                        >
                            Back to All Products
                        </button>
                    </div>
                ) : (
                    <>
                        <section
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12"
                            aria-label="Product grid"
                        >
                            {paginatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    aria-label={`View details for ${product.name}`}
                                />
                            ))}
                        </section>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <nav
                                className="flex justify-center items-center flex-wrap gap-2 sm:gap-3 mb-24"
                                aria-label="Pagination navigation"
                            >
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                    className={`px-4 py-2 rounded-md border text-sm transition focus:ring-2 focus:ring-primary focus:outline-none ${currentPage === 1
                                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    aria-label="Previous page"
                                >
                                    ← Prev
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium border focus:ring-2 focus:ring-primary focus:outline-none ${currentPage === i + 1
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        aria-current={currentPage === i + 1 ? 'page' : undefined}
                                        aria-label={`Go to page ${i + 1}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                    className={`px-4 py-2 rounded-md border text-sm transition focus:ring-1 focus:ring-primary focus:outline-none ${currentPage === totalPages
                                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    aria-label="Next page"
                                >
                                    Next →
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div aria-busy="true">Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    )
}
