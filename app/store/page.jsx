'use client'
import { useEffect, useState } from 'react'
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { motion } from "framer-motion"
import {
    CircleDollarSignIcon,
    ShoppingBasketIcon,
    StarIcon,
    TagsIcon
} from "lucide-react"

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
        <div className="text-slate-700 mb-28 ">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
                <h1 className="text-2xl font-medium mb-8 text-primary">
                    Seller <span className="text-customBlack">Dashboard</span>
                </h1>
                <p className="text-slate-400 text-sm">Overview of your store's performance</p>
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardCardsData.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h2 className="text-3xl font-medium mt-2 text-slate-800 tracking-tight">
                                    {card.value}
                                </h2>
                            </div>
                            <div className='p-3 rounded-full bg-secondary text-primary'>
                                <card.icon size={26} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Latest Reviews Section */}
            <div className="mt-16 max-w-6xl">
                <h2 className="text-xl font-medium text-slate-800 mb-5 flex items-center gap-2">
                    <StarIcon className="text-[#FFC107]" size={22} /> Latest Reviews
                </h2>

                {dashboardData.ratings.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-xl py-16 text-center shadow-sm">
                        <p className="text-slate-400 italic">No reviews yet. Your latest reviews will appear here.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xs divide-y divide-slate-200">
                        {dashboardData.ratings.map((review, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
                            >
                                {/* Left: Reviewer Info */}
                                <div className="flex gap-4 items-start">
                                    <Image
                                        src={review.user.image}
                                        alt={review.user.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover w-12 h-12 ring-1 ring-slate-200"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-800">{review.user.name}</p>
                                        <p className="text-xs text-slate-400">{new Date(review.createdAt).toDateString()}</p>
                                        <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-md">
                                            {review.review}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Product Info */}
                                <div className="flex flex-col sm:items-end text-sm">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">{review.product?.category}</p>
                                        <p className="font-medium text-slate-700">{review.product?.name}</p>
                                        <div className="flex justify-end gap-0.5 mt-1">
                                            {Array(5).fill('').map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    size={15}
                                                    fill={review.rating >= i + 1 ? "#facc15" : "#e2e8f0"}
                                                    className="text-transparent"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/product/${review.product.id}`)}
                                        className="mt-3 text-sm text-primary border border-slate-300 px-4 py-1.5 rounded-md hover:bg-secondary transition-all"
                                    >
                                        View Product
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
