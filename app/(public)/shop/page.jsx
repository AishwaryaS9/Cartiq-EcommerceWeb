'use client'
import { Suspense, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import { MoveLeftIcon, FilterIcon, ArrowUpDownIcon } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import SkeletonLoading from "@/components/SkeletonLoading"
import Pagination from "@/components/Pagination"

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
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
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
