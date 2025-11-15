'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { PackageSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import Loading from "@/components/Loading"
import Pagination from "@/components/Pagination"

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const { getToken } = useAuth()

    const ordersPerPage = 10;

    const fetchOrders = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/orders', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrders(data.orders)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = await getToken()
            await axios.post('/api/store/orders', { orderId, status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order))
            toast.success('Order status updated!')
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
        document.body.style.overflow = "hidden"
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
        document.body.style.overflow = "auto"
    }

    useEffect(() => { fetchOrders() }, [])

    // Pagination logic
    const indexOfLastProduct = currentPage * ordersPerPage
    const indexOfFirstProduct = indexOfLastProduct - ordersPerPage
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(orders.length / ordersPerPage)


    if (loading) return <Loading />

    return (
        <main
            className="text-slate-700 mb-20 px-4 sm:px-6 md:px-8"
            role="main"
            aria-label="Store Orders Section"
        >
            <h1 className="text-2xl font-medium mb-8 text-primary tracking-tight">
                Store <span className="text-slate-700">Orders</span>
            </h1>

            {orders.length === 0 ? (
                <section
                    className="flex flex-col items-center justify-center text-center py-20"
                    aria-label="No orders found"
                >
                    <div
                        className="bg-slate-100 rounded-full p-6 mb-6 shadow-sm"
                        role="img"
                        aria-label="No orders illustration"
                    >
                        <PackageSearch className="w-12 h-12 text-primary" aria-hidden="true" />
                    </div>
                    <p className="text-slate-600 text-base max-w-sm">
                        No orders found. Once customers place orders, you'll see them listed here.
                    </p>
                </section>
            ) : (
                <>
                    <div
                        className="hidden lg:block relative rounded-sm shadow-xs border border-slate-200 bg-white max-w-6xl mx-auto overflow-hidden"
                        role="region"
                        aria-label="Orders Table">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent scroll-smooth">
                            <table className="w-full text-sm text-left" aria-describedby="orders-table">
                                <thead className="bg-secondary text-slate-700 uppercase text-xs tracking-wide">
                                    <tr>
                                        {["#", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((heading, i) => (
                                            <th
                                                key={i}
                                                scope="col"
                                                className="px-5 py-3 font-semibold"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order, i) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-t border-slate-100 hover:bg-secondary/50 cursor-pointer transition"
                                            onClick={() => openModal(order)}
                                            tabIndex={0}
                                            role="button"
                                            aria-label={`Open details for order ${indexOfFirstProduct + i + 1} by ${order.user?.name}`}
                                        >
                                            <td className="pl-5 text-primary font-medium">{indexOfFirstProduct + i + 1}</td>
                                            <td className="px-5 py-3">{order.user?.name}</td>
                                            <td className="px-5 py-3 font-medium text-slate-700">${order.total}</td>
                                            <td className="px-5 py-3 text-slate-600">{order.paymentMethod}</td>
                                            <td className="px-5 py-3">
                                                {order.isCouponUsed ? (
                                                    <span
                                                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                                                        aria-label={`Coupon code ${order.coupon?.code}`}
                                                    >
                                                        {order.coupon?.code}
                                                    </span>
                                                ) : "—"}
                                            </td>
                                            <td
                                                className="px-5 py-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <label htmlFor={`status-${order.id}`} className="sr-only">
                                                    Update order status
                                                </label>
                                                <select
                                                    id={`status-${order.id}`}
                                                    value={order.status}
                                                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                                                    className="border border-slate-300 rounded-md text-xs px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                                                    aria-label={`Change status for order ${indexOfFirstProduct + i + 1}`}
                                                >
                                                    <option value="ORDER_PLACED">ORDER_PLACED</option>
                                                    <option value="PROCESSING">PROCESSING</option>
                                                    <option value="SHIPPED">SHIPPED</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                </select>
                                            </td>
                                            <td className="px-5 py-3 text-slate-500">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section
                        className="lg:hidden flex flex-col gap-4 mt-4"
                        aria-label="Orders List">
                        {currentOrders.map((order, i) => (
                            <motion.article
                                key={order.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => openModal(order)}
                                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                                tabIndex={0}
                            >
                                <header className="flex justify-between items-center mb-3">
                                    <p className="font-medium text-customBlack">Order #{indexOfFirstProduct + i + 1}</p>
                                    <time
                                        className="text-xs text-slate-500"
                                        dateTime={order.createdAt}
                                    >
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </time>
                                </header>

                                <p className="text-sm text-slate-700 mb-1"><span className="font-medium">Customer:</span> {order.user?.name}</p>
                                <p className="text-sm text-slate-700 mb-1"><span className="font-medium">Total:</span> ${order.total}</p>
                                <p className="text-sm text-slate-700 mb-1"><span className="font-medium">Payment:</span> {order.paymentMethod}</p>
                                {order.isCouponUsed && (
                                    <p className="text-xs text-green-600 mt-1">
                                        Coupon: {order.coupon.code} ({order.coupon.discount}% off)
                                    </p>
                                )}
                                <div className="flex justify-between items-center mt-3">
                                    <select
                                        value={order.status}
                                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="border border-slate-300 rounded-md text-xs px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none bg-white"
                                        aria-label="Change order status"
                                    >
                                        <option value="ORDER_PLACED">ORDER_PLACED</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                    </select>
                                    <span className="text-xs text-slate-500">{order.status}</span>
                                </div>
                            </motion.article>
                        ))}
                    </section>
                </>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        role="dialog"
                        aria-modal="true"
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 text-sm relative"
                        >
                            <h2
                                id="address-modal-title"
                                className="text-xl md:text-2xl font-medium text-primary mb-5 text-center"
                            >
                                Order <span className="font-medium text-slate-700">Details</span>
                            </h2>

                            <div className="mb-6 space-y-6">
                                <section className="rounded-lg p-4 bg-slate-50">
                                    <h3 className="font-medium mb-2 text-primary">Customer Details</h3>
                                    <div className="space-y-1 text-slate-700">
                                        <p><span className="font-medium">Name:</span> {selectedOrder.user?.name}</p>
                                        <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedOrder.address?.phone}</p>
                                        <p><span className="font-medium">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="font-medium mb-3 text-primary">Products</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 border border-slate-200 rounded-lg p-3 bg-white/60">
                                                <img
                                                    src={item.product.images?.[0].src || item.product.images?.[0]}
                                                    alt={`Product image of ${item.product?.name}`}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                    loading="lazy"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-customBlack">{item.product?.name}</p>
                                                    <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                                                    <p className="text-xs text-slate-600">Price: ${item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-lg p-4 bg-slate-50">
                                    <h3 className="font-medium mb-2 text-primary">Payment & Status</h3>
                                    <div className="space-y-1 text-slate-700">
                                        <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                                        <p><span className="font-medium">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                                        {selectedOrder.isCouponUsed && (
                                            <p><span className="font-medium">Coupon:</span> {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}% off)</p>
                                        )}
                                        <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                                        <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                </section>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    )
}
