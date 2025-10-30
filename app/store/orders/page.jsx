'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { getToken } = useAuth()

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
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => { fetchOrders() }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-700 mb-20">
            <h1 className="text-2xl font-medium mb-8 text-primary">
                Store <span className="text-customBlack">Orders</span>
            </h1>

            {orders.length === 0 ? (
                <p className="text-slate-500 italic">No orders found.</p>
            ) : (
                <div className="overflow-x-auto rounded-sm shadow-xs border border-slate-200 bg-white max-w-5xl">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary text-slate-700 uppercase text-xs tracking-wide">
                            <tr>
                                {["#", "Customer", "Total", "Payment", "Coupon", "Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-5 py-3 font-semibold">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, i) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-t border-slate-100 hover:bg-secondary/50 cursor-pointer transition"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-5 text-primary font-medium">{i + 1}</td>
                                    <td className="px-5 py-3">{order.user?.name}</td>
                                    <td className="px-5 py-3 font-semibold text-customBlack">${order.total}</td>
                                    <td className="px-5 py-3 text-slate-600">{order.paymentMethod}</td>
                                    <td className="px-5 py-3">
                                        {order.isCouponUsed ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                {order.coupon?.code}
                                            </span>
                                        ) : "—"}
                                    </td>
                                    <td
                                        className="px-5 py-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className="border border-slate-300 rounded-md text-xs px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
                                        >
                                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">{new Date(order.createdAt).toLocaleString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 text-sm relative"
                        >
                            <h2 className="text-xl font-semibold text-customBlack mb-5 text-center">
                                Order Details
                            </h2>

                            {/* Customer Details */}
                            <div className="mb-6  rounded-lg p-4">
                                <h3 className="font-semibold mb-2 text-primary">Customer Details</h3>
                                <div className="space-y-1 text-slate-700">
                                    <p><span className="font-medium">Name:</span> {selectedOrder.user?.name}</p>
                                    <p><span className="font-medium">Email:</span> {selectedOrder.user?.email}</p>
                                    <p><span className="font-medium">Phone:</span> {selectedOrder.address?.phone}</p>
                                    <p><span className="font-medium">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-primary">Products</h3>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 border border-slate-200 rounded-sm p-3">
                                            <img
                                                src={item.product.images?.[0].src || item.product.images?.[0]}
                                                alt={item.product?.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-customBlack">{item.product?.name}</p>
                                                <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                                                <p className="text-xs text-slate-600">Price: ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment & Status */}
                            <div className="mb-6  rounded-lg p-4">
                                <h3 className="font-semibold mb-2 text-primary">Payment & Status</h3>
                                <div className="space-y-1 text-slate-700">
                                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                                    <p><span className="font-medium">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                                    {selectedOrder.isCouponUsed && (
                                        <p><span className="font-medium">Coupon:</span> {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}% off)</p>
                                    )}
                                    <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                                    <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Close Button */}
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
        </div>
    )
}
