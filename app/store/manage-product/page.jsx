'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Head from "next/head"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { PackageX, Plus } from "lucide-react"
import Loading from "@/components/Loading"

export default function StoreManageProducts() {
    const { getToken } = useAuth()
    const { user } = useUser()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/product', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const toggleStock = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/store/stock-toggle', { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p))
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchProducts()
    }, [user])

    if (loading) return <Loading aria-label="Loading products" role="status" />

    return (
        <>
            <Head>
                <title>Manage Products | Store Dashboard</title>
                <meta name="description" content="Manage your store products, update stock status, and view product details in your store dashboard." />
                <meta name="robots" content="index, follow" />
            </Head>

            <main
                className="text-slate-700 mb-28 min-h-[calc(100vh-200px)] overflow-hidden"
                role="main"
                aria-labelledby="page-title"
            >
                <h1 id="page-title" className="text-2xl font-medium mb-8 text-primary">
                    Manage <span className="text-slate-700">Products</span>
                </h1>

                {/* Empty state */}
                {products.length === 0 && (
                    <section
                        className="flex flex-col justify-center items-center text-center px-4"
                        aria-label="Empty product list"
                    >
                        <h2 className="text-2xl font-medium mb-6 text-primary">
                            Manage <span className="text-customBlack">Products</span>
                        </h2>

                        <div
                            className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm max-w-md w-full"
                            role="region"
                            aria-labelledby="no-products"
                        >
                            <div className="flex flex-col items-center justify-center mb-5">
                                <div className="bg-slate-100 rounded-full p-6 mb-6 shadow-sm" aria-hidden="true">
                                    <PackageX className="w-12 h-12 text-primary" />
                                </div>
                                <p id="no-products" className="text-slate-600 mb-6">
                                    No products found. Please add products to manage them here.
                                </p>
                                <button
                                    type="button"
                                    aria-label="Add new product"
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg shadow-sm transition"
                                    onClick={() => router.push('/store/add-product')}
                                >
                                    <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Product list view */}
                {products.length > 0 && (
                    <>
                        {/* Desktop Table */}
                        <div
                            className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl shadow-xs bg-white"
                            role="region"
                            aria-label="Product management table"
                        >
                            <table className="w-full text-left text-sm" role="table">
                                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                                    <tr role="row">
                                        <th scope="col" className="px-6 py-3 font-medium">Product</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Description</th>
                                        <th scope="col" className="px-6 py-3 font-medium">MRP</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Price</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Quantity</th>
                                        <th scope="col" className="px-6 py-3 font-medium text-center">In Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-t border-slate-100 hover:bg-slate-50 transition"
                                            role="row"
                                        >
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={`${product.name} image`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-md object-cover border border-slate-200"
                                                    />
                                                    <p className="font-medium text-slate-800">{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-slate-500 max-w-md truncate">{product.description}</td>
                                            <td className="px-6 py-3">{currency} {product.mrp.toLocaleString()}</td>
                                            <td className="px-6 py-3 font-medium text-customBlack">{currency} {product.price.toLocaleString()}</td>
                                            <td className="px-6 py-3">{product.stockQuantity}</td>
                                            <td className="px-6 py-3 text-center">
                                                <label
                                                    htmlFor={`stock-toggle-${product.id}`}
                                                    className="relative inline-flex items-center cursor-pointer"
                                                    aria-label={`Toggle stock status for ${product.name}`}
                                                >
                                                    <input
                                                        id={`stock-toggle-${product.id}`}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={product.inStock}
                                                        onChange={() =>
                                                            toast.promise(toggleStock(product.id), { loading: "Updating stock..." })
                                                        }
                                                    />
                                                    <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                                    <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                                                </label>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden flex flex-col gap-4" role="list" aria-label="Mobile product list">
                            {products.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all"
                                    role="listitem"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Image
                                            src={product.images[0]}
                                            alt={`${product.name} product image`}
                                            width={60}
                                            height={60}
                                            className="rounded-md object-cover border border-slate-200"
                                        />
                                        <div>
                                            <p className="font-medium text-customBlack">{product.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{product.category}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>

                                    <div className="flex justify-between items-center text-sm text-slate-700">
                                        <div className="flex flex-col">
                                            <p className="text-xs text-slate-500">Price</p>
                                            <p className="font-medium">
                                                {currency}
                                                {product.price.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-slate-500">Quantity</p>
                                            <p className="font-medium">{product.stockQuantity}</p>
                                        </div>

                                        <label
                                            htmlFor={`mobile-stock-toggle-${product.id}`}
                                            className="relative inline-flex items-center cursor-pointer ml-3"
                                            aria-label={`Toggle stock status for ${product.name}`}
                                        >
                                            <input
                                                id={`mobile-stock-toggle-${product.id}`}
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.inStock}
                                                onChange={() =>
                                                    toast.promise(toggleStock(product.id), { loading: "Updating stock..." })
                                                }
                                            />
                                            <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </>
                )}
            </main>
        </>
    )
}
