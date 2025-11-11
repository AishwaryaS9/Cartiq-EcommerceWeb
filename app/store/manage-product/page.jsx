'use client'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Head from "next/head"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { PackageX, PenLine, Plus } from "lucide-react"
import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"
import EditProductModal from "@/components/store/EditProductModal"
import { updateProduct } from "@/lib/features/product/productSlice"

export default function StoreManageProducts() {
    const { getToken } = useAuth()
    const { user } = useUser()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const dispatch = useDispatch()

    const productsPerPage = 10

    const handleEditClick = (product) => {
        setEditingProduct({
            ...product,
            existingImages: product.images || [],
            newImages: [],
            removedImages: [],
        })
        setIsEditModalOpen(true)
    }

    const handleModalClose = () => {
        setIsEditModalOpen(false)
        setEditingProduct(null)
    }

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

    const handleProductUpdate = async (e) => {
        e.preventDefault()
        const token = await getToken()
        const remainingImagesCount =
            (editingProduct.existingImages?.length || 0) +
            (editingProduct.newImages?.length || 0)

        if (remainingImagesCount === 0) {
            toast.error("At least one product image is required.")
            return
        }

        const formData = new FormData()
        formData.append('id', editingProduct.id)
        formData.append('name', editingProduct.name)
        formData.append('description', editingProduct.description)
        formData.append('mrp', editingProduct.mrp)
        formData.append('price', editingProduct.price)
        formData.append('stockQuantity', editingProduct.stockQuantity)
        formData.append('category', editingProduct.category)
        formData.append('replaceImages', editingProduct.replaceImages ? 'true' : 'false')

        if (editingProduct.removedImages?.length > 0) {
            formData.append('removedImages', JSON.stringify(editingProduct.removedImages))
        }
        if (editingProduct.newImages?.length > 0) {
            editingProduct.newImages.forEach((img) => formData.append('images', img))
        }

        const result = await dispatch(updateProduct({ token, productData: formData }))

        if (updateProduct.fulfilled.match(result)) {
            toast.success('Product updated successfully')
            handleModalClose()
            fetchProducts()
        } else {
            toast.error(result.payload?.error || 'Failed to update product')
        }
    }

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(products.length / productsPerPage)

    if (loading) return <Loading aria-label="Loading products" role="status" />

    return (
        <>
            <Head>
                <title>Manage Products | Store Dashboard</title>
                <meta name="description" content="Manage your store products, update stock status, and view product details in your store dashboard." />
                <meta name="robots" content="index, follow" />
            </Head>

            <main className="text-slate-700 mb-28 min-h-[calc(100vh-200px)] overflow-hidden " role="main"
                aria-labelledby="page-title">
                <h1 id="page-title" className="text-2xl font-medium mb-8 text-primary text-center sm:text-left">
                    Manage <span className="text-slate-700">Products</span>
                </h1>

                {/* Empty State */}
                {products.length === 0 && (
                    <section className="flex flex-col justify-center items-center text-center px-4" aria-label="Empty product list">
                        <h2 className="text-xl sm:text-2xl font-medium mb-6 text-primary">
                            Manage <span className="text-customBlack">Products</span>
                        </h2>
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm max-w-md w-full" role="region"
                            aria-labelledby="no-products">
                            <div className="flex flex-col items-center justify-center mb-5">
                                <div className="bg-slate-100 rounded-full p-5 sm:p-6 mb-6 shadow-sm">
                                    <PackageX className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                                </div>
                                <p id="no-products" className="text-slate-600 mb-6 text-sm sm:text-base">
                                    No products found. Please add products to manage them here.
                                </p>
                                <button
                                    type="button" aria-label="Add new product"
                                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 sm:px-5 py-2 rounded-lg shadow-sm transition text-sm sm:text-base"
                                    onClick={() => router.push('/store/add-product')}
                                >
                                    <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Product Table / Cards */}
                {products.length > 0 && (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl shadow-xs bg-white"
                            role="region"
                            aria-label="Product management table">
                            <table className="w-full text-left text-sm" role="table">
                                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                                    <tr role="row">
                                        <th scope="col" className="px-6 py-3 font-medium">Product</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Description</th>
                                        <th scope="col" className="px-6 py-3 font-medium">MRP</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Price</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Qty</th>
                                        <th scope="col" className="px-6 py-3 font-medium text-center">Stock</th>
                                        <th scope="col" className="px-6 py-3 font-medium text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product, i) => (
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
                                            <td className="px-6 py-3 w-25">{currency} {product.mrp.toLocaleString()}</td>
                                            <td className="px-6 py-3 font-medium text-customBlack w-25">{currency} {product.price.toLocaleString()}</td>
                                            <td className="px-6 py-3 text-center">{product.stockQuantity}</td>
                                            <td className="px-6 py-3 text-center">
                                                <label htmlFor={`stock-toggle-${product.id}`}
                                                    aria-label={`Toggle stock status for ${product.name}`}
                                                    className="relative inline-flex items-center cursor-pointer">
                                                    <input id={`stock-toggle-${product.id}`}
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={product.inStock}
                                                        onChange={() =>
                                                            toast.promise(toggleStock(product.id), { loading: "Updating..." })
                                                        }
                                                    />
                                                    <div className="w-8 h-4 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                                    <span className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-4"></span>
                                                </label>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-primary hover:underline text-sm"
                                                >
                                                    <PenLine size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden grid grid-cols-1 gap-4" role="list" aria-label="Mobile product list">
                            {currentProducts.map((product) => (
                                <div key={product.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={50}
                                                height={50}
                                                className="rounded-lg object-cover border border-slate-200"
                                            />
                                            <p className="font-medium text-slate-800 text-sm">{product.name}</p>
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="text-primary hover:underline text-xs"
                                        >
                                            <PenLine size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">{product.description}</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="">{currency}{product.price}</span>
                                        <span>Qty: {product.stockQuantity}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.inStock}
                                                onChange={() =>
                                                    toast.promise(toggleStock(product.id), { loading: "Updating..." })
                                                }
                                            />
                                            <div className="w-8 h-4 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                            <span className="absolute left-0.5 top-0.6 w-3 h-3 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </main>

            {/* Edit Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                product={editingProduct}
                onClose={handleModalClose}
                onChange={setEditingProduct}
                onSubmit={handleProductUpdate}
            />
        </>
    )
}
