'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    StoreIcon,
    TagsIcon
} from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function AdminDashboard() {
    const { getToken } = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue.toLocaleString(), icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setDashboardData(data.dashboardData)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-700 mb-20 px-4 sm:px-6 lg:px-10">
            <h1 className="text-2xl font-medium mb-8 text-primary">
                Admin <span className="text-customBlack">Dashboard</span>
            </h1>

            {/* Dashboard Summary Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCardsData.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-6 rounded-2xl bg-white border border-slate-200 
                                   shadow-xs"
                    >
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-slate-500">{card.title}</p>
                            <h2 className="text-3xl font-medium text-customBlack">
                                {card.value}
                            </h2>
                        </div>
                        <div className="p-3 rounded-full bg-secondary text-primary">
                            <card.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Orders Area Chart */}
            <div className="mt-16 p-6 rounded-2xl bg-white ">
                <h2 className="text-lg font-medium text-customBlack mb-4">
                    Orders Overview
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    A visual representation of order trends and store performance.
                </p>
                <div className="overflow-hidden">
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>
            </div>
        </div>
    )
}
