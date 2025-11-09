'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"

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
        { title: 'Total Revenue', value: `${currency}${dashboardData.revenue.toLocaleString()}`, icon: CircleDollarSignIcon },
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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <main
            className="text-slate-700 mb-20 px-4 sm:px-6 lg:px-10"
            role="main"
            aria-label="Admin dashboard main content area"
        >
            {/* Dashboard Header */}
            <header className="mb-8" role="banner" aria-label="Dashboard heading section">
                <h1 className="text-2xl font-medium text-primary">
                    Admin <span className="text-slate-700">Dashboard</span>
                </h1>
                <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl"
                    aria-label="Overview of key performance metrics and recent order activity">
                    Overview of key performance metrics and recent order activity.
                </p>
            </header>

            {/* Dashboard Summary Cards */}
            <section
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                role="region"
                aria-label="Dashboard summary cards"
            >
                {dashboardCardsData.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300"
                        role="group"
                        tabIndex={0}
                        aria-label={`${card.title}: ${card.value}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h2 className="text-3xl font-medium mt-2 text-slate-800 tracking-tight">
                                    {card.value}
                                </h2>
                            </div>
                            <div
                                className="p-3 rounded-full bg-secondary text-primary"
                                aria-hidden="true"
                            >
                                <card.icon size={26} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Orders Area Chart */}
            <section
                className="mt-16 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs"
                role="region"
                aria-label="Orders overview chart"
            >
                <h2 className="text-lg font-medium text-customBlack mb-4">
                    Orders Overview
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    Visual representation of order trends and store performance over time.
                </p>
                <div
                    className="overflow-hidden"
                    role="img"
                    aria-label="Line chart showing orders performance trend"
                >
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>
            </section>
        </main>
    )
}

