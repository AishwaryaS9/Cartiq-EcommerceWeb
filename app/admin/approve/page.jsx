'use client'
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Building2 } from "lucide-react"
import Loading from "@/components/Loading"
import StoreInfo from "@/components/admin/StoreInfo"

export default function AdminApprove() {
    const { user } = useUser()
    const { getToken } = useAuth()

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/approve-store', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStores(data.stores)
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
        setLoading(false)
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const token = await getToken()
            const { data } = await axios.post(
                '/api/admin/approve-store',
                { storeId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success(data.message)
            await fetchStores()
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchStores()
    }, [user])

    // Loading state
    if (loading) return <Loading />

    return (
        <main
            className="text-slate-600 mb-28 px-4 sm:px-6 lg:px-10"
            role="main"
            aria-label="Admin store approval dashboard"
        >
            {/* Header */}
            <header
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-3"
                role="banner"
            >
                <div>
                    <h1
                        className="text-2xl font-medium text-primary"
                        aria-label="Approve Stores heading"
                    >
                        Approve <span className="text-slate-700">Stores</span>
                    </h1>
                    <p
                        className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl"
                        aria-label="Page description"
                    >
                        Review pending store applications and manage approvals.
                    </p>
                </div>
            </header>

            {/* Store List */}
            {stores.length > 0 ? (
                <section
                    className="flex flex-col gap-5 mt-6"
                    role="region"
                    aria-label="List of pending store applications"
                >
                    {stores.map((store) => (
                        <motion.article
                            key={store.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 max-w-4xl w-full mx-auto"
                            role="group"
                            aria-labelledby={`store-${store.id}-name`}
                        >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions */}
                            <div
                                className="flex gap-3 pt-2 flex-wrap md:justify-end"
                                role="group"
                                aria-label={`Approval actions for ${store.name}`}
                            >
                                <button
                                    onClick={() =>
                                        toast.promise(
                                            handleApprove({
                                                storeId: store.id,
                                                status: 'approved'
                                            }),
                                            { loading: 'Approving...' }
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                                    aria-label={`Approve ${store.name} store`}
                                >
                                    <CheckCircle
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                    Approve
                                </button>

                                <button
                                    onClick={() =>
                                        toast.promise(
                                            handleApprove({
                                                storeId: store.id,
                                                status: 'rejected'
                                            }),
                                            { loading: 'Rejecting...' }
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                    aria-label={`Reject ${store.name} store`}
                                >
                                    <XCircle
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                    Reject
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </section>
            ) : (
                // Empty State
                <section
                    className="flex flex-col items-center justify-center h-80 text-center"
                    role="status"
                    aria-live="polite"
                    aria-label="No store applications pending"
                >
                    <div
                        className="bg-slate-100 p-6 rounded-full mb-4"
                        aria-hidden="true"
                    >
                        <Building2 className="w-12 h-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-medium text-slate-500">
                        No Applications Pending
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        All stores have been reviewed.
                    </p>
                </section>
            )}
        </main>
    )
}
