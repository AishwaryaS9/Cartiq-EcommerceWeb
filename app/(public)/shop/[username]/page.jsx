'use client'
import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { MailIcon, MapPinIcon, StoreIcon } from "lucide-react"
import Loading from "@/components/Loading"
import ProductCard from "@/components/ProductCard"

export default function StoreShop() {
    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const fetchStoreData = async () => {
        try {
            const { data } = await axios.get(`/api/store/data?username=${username}`)
            setStoreInfo(data.store)
            setProducts(data.store.Product || [])
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to load store information.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStoreData()
    }, [username])

    const totalPages = Math.ceil(products.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = useMemo(
        () => products.slice(startIndex, startIndex + itemsPerPage),
        [products, currentPage, itemsPerPage]
    )

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
        window.scrollTo({ top: 300, behavior: "smooth" })
    }

    if (loading) return <Loading />

    if (!storeInfo) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center text-slate-600">
                <StoreIcon size={48} className="mb-3 text-slate-400" aria-hidden="true" />
                <p className="text-lg font-medium">Store not found.</p>
                <p className="text-sm text-slate-500 mt-1">
                    Please check the URL or try again later.
                </p>
            </div>
        )
    }

    return (
        <main className="min-h-[70vh] mx-6">
            {/* Store Info Banner */}
            <motion.section
                className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 md:p-12 mt-8 flex flex-col md:flex-row items-center md:items-start gap-8 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                aria-labelledby="store-header"
            >
                <Image
                    src={storeInfo.logo}
                    alt={`${storeInfo.name} store logo`}
                    className="size-32 sm:size-40 object-cover border-2 border-slate-200 rounded-xl shadow-sm"
                    width={200}
                    height={200}
                    priority
                />

                <div className="flex-1 text-center md:text-left space-y-4">
                    <h1
                        id="store-header"
                        className="text-2xl md:text-3xl font-semibold text-slate-700"
                    >
                        {storeInfo.name}
                    </h1>

                    <p className="text-slate-600 text-base max-w-2xl mx-auto md:mx-0 justify-center">
                        {storeInfo.description || "This seller hasn't added a description yet."}
                    </p>

                    <div className="space-y-2 text-sm text-slate-500 pt-3">
                        {storeInfo.address && (
                            <p className="flex justify-center md:justify-start items-center gap-2">
                                <MapPinIcon size={16} className="text-primary" aria-hidden="true" />
                                <span>{storeInfo.address}</span>
                            </p>
                        )}
                        {storeInfo.email && (
                            <p className="flex justify-center md:justify-start items-center gap-2">
                                <MailIcon size={16} className="text-primary" aria-hidden="true" />
                                <a
                                    href={`mailto:${storeInfo.email}`}
                                    className="hover:text-primary hover:underline"
                                >
                                    {storeInfo.email}
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Product Grid */}
            <section
                className="max-w-7xl mx-auto mb-32 mt-16"
                aria-labelledby="shop-products-title"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 id="shop-products-title"
                        onClick={() => router.push('/shop')}
                        className="text-3xl md:text-2xl font-medium text-primary">

                        <span>Shop</span>{' '}
                        <span className="text-slate-700 font-medium">Products</span>
                    </h2>

                    <p className="text-slate-500 text-sm">
                        {products.length} {products.length === 1 ? "item" : "items"} available
                    </p>
                </div>

                {products.length > 0 ? (
                    <>
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            {paginatedProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav
                                className="flex justify-center items-center gap-2 mt-16"
                                role="navigation"
                                aria-label="Product pagination"
                            >
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    aria-label="Previous page"
                                    className={`px-4 py-2 border rounded-md text-sm transition ${currentPage === 1
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    ← Prev
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        aria-label={`Page ${i + 1}`}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium border ${currentPage === i + 1
                                            ? "bg-primary text-white border-primary"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                    className={`px-4 py-2 border rounded-md text-sm transition ${currentPage === totalPages
                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                        : "text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    Next →
                                </button>
                            </nav>
                        )}
                    </>
                ) : (
                    <p className="text-slate-500 text-center mt-16 text-sm">
                        No products found for this store.
                    </p>
                )}
            </section>
        </main>
    )
}

