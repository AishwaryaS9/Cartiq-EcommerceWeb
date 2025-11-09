'use client'
import { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import axios from "axios"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Loading from "@/components/Loading"

export default function Dashboard() {
    const { getToken } = useAuth()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings.toLocaleString(), icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Ratings', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
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
            className="text-slate-700 mb-28"
            role="main"
            aria-label="Seller dashboard overview"
        >
            {/* Header */}
            <header className="flex items-center justify-between flex-wrap gap-3 mb-10">
                <h1
                    className="text-2xl font-medium mb-8 text-primary"
                    tabIndex="0"
                >
                    Seller <span className="text-slate-700">Dashboard</span>
                </h1>
                <p
                    className="text-slate-400 text-sm"
                    aria-label="Overview of your store performance"
                >
                    Overview of your store's performance
                </p>
            </header>

            {/* Dashboard Summary Cards */}
            <section
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                aria-label="Store performance summary cards"
            >
                {dashboardCardsData.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300"
                        role="group"
                        aria-label={`${card.title}: ${typeof card.value === 'string' ? card.value : card.value.toLocaleString()}`}
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

            {/* Latest Reviews Section */}
            <section
                className="mt-16 max-w-6xl"
                aria-label="Latest customer reviews"
            >
                <h2
                    className="text-xl font-medium text-slate-800 mb-5 flex items-center gap-2"
                    tabIndex="0"
                >
                    <StarIcon
                        className="text-[#FFC107]"
                        size={22}
                        aria-hidden="true"
                    />
                    Latest Reviews
                </h2>

                {dashboardData.ratings.length === 0 ? (
                    <div
                        className="bg-white border border-slate-200 rounded-xl py-16 text-center shadow-sm"
                        role="note"
                        aria-label="No reviews yet"
                    >
                        <p className="text-slate-400 italic">
                            No reviews yet. Your latest reviews will appear here.
                        </p>
                    </div>
                ) : (
                    <div
                        className="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-200"
                        role="list"
                    >
                        {dashboardData.ratings.map((review, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
                                role="listitem"
                                aria-label={`Review by ${review.user.name} for ${review.product?.name}`}
                            >
                                {/* Reviewer Info */}
                                <div className="flex gap-4 items-start">
                                    <Image
                                        src={review.user.image}
                                        alt={`${review.user.name}'s profile picture`}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12 ring-1 ring-slate-200"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-800">{review.user.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(review.createdAt).toDateString()}
                                        </p>
                                        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-md">
                                            {review.review}
                                        </p>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col sm:items-end text-sm">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">{review.product?.category}</p>
                                        <p className="font-medium text-slate-700">{review.product?.name}</p>
                                        <div
                                            className="flex justify-end gap-0.5 mt-1"
                                            aria-label={`Rating: ${review.rating} out of 5 stars`}
                                        >
                                            {Array(5)
                                                .fill('')
                                                .map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        size={15}
                                                        fill={review.rating >= i + 1 ? "#facc15" : "#e2e8f0"}
                                                        className="text-transparent"
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/product/${review.product.id}`)}
                                        className="mt-3 text-sm text-primary border border-slate-300 px-4 py-1.5 rounded-md hover:bg-secondary transition-all focus:outline-none focus:ring-1 focus:ring-primary/40"
                                        aria-label={`View product details for ${review.product?.name}`}
                                    >
                                        View Product
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
