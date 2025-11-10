'use client'
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Building2 } from "lucide-react"
import Loading from "@/components/Loading"
import StoreInfo from "@/components/admin/StoreInfo"

export default function AdminStores() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/stores', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setStores(data.stores)
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
        setLoading(false)
    }

    const toggleIsActive = async (storeId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post(
                '/api/admin/toggle-store',
                { storeId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            await fetchStores()
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchStores()
    }, [user])

    if (loading) return <Loading />

    return (
        <main
            className="text-slate-600 mb-28 px-4 md:px-8"
            role="main"
            aria-label="Admin store management section"
        >
            {/* Header */}
            <header
                className="mb-6 text-center md:text-left"
                role="banner"
                aria-label="Live stores header section"
            >
                <h1 className="text-2xl font-medium text-primary">
                    Live <span className="text-slate-700">Stores</span>
                </h1>
                <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
                    Manage store visibility and activation status.
                </p>
            </header>

            {/* Store List */}
            {stores.length ? (
                <section
                    className="flex flex-col gap-5 mt-4"
                    role="region"
                    aria-label="List of active stores"
                >
                    {stores.map((store) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-sm transition-all duration-300 p-6 flex flex-col gap-4 max-w-4xl w-full"
                            role="article"
                            aria-label={`Store ${store.name || store.id}`}
                        >
                            {/* Store Info */}
                            <div role="group" aria-label={`Store information for ${store.name || "store"}`}>
                                <StoreInfo store={store} />
                            </div>

                            {/* Actions */}
                            <div
                                className="flex flex-wrap md:flex-nowrap items-center gap-3 pt-2 md:justify-end justify-between"
                                role="group"
                                aria-label={`Actions for ${store.name || "store"}`}
                            >
                                <p
                                    className="text-sm font-medium"
                                    aria-live="polite"
                                >
                                    {store.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-rose-500">Inactive</span>
                                    )}
                                </p>

                                {/* Accessible toggle switch */}
                                <label
                                    className="relative inline-flex items-center cursor-pointer group"
                                    htmlFor={`store-toggle-${store.id}`}
                                    aria-label={`Toggle active status for ${store.name || "store"}`}
                                >
                                    <input
                                        id={`store-toggle-${store.id}`}
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={store.isActive}
                                        onChange={() =>
                                            toast.promise(toggleIsActive(store.id), {
                                                loading: "Updating store status...",
                                                success: "Store status updated",
                                                error: "Failed to update store status",
                                            })
                                        }
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                                </label>
                            </div>
                        </motion.div>
                    ))}
                </section>
            ) : (
                // Empty State
                <section
                    className="flex flex-col items-center justify-center h-80 text-center"
                    role="region"
                    aria-label="No stores available message"
                >
                    <div
                        className="bg-slate-100 p-6 rounded-full mb-4"
                        aria-hidden="true"
                    >
                        <Building2 className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-2xl text-slate-500 font-medium">
                        No stores available
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Your active stores will appear here.
                    </p>
                </section>
            )}
        </main>
    )
}
