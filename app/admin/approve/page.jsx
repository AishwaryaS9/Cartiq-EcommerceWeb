'use client'

import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Building2 } from "lucide-react"

export default function AdminApprove() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/admin/approve-store', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStores(data.stores);
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
        setLoading(false);
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/admin/approve-store', {
                storeId, status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message);
            await fetchStores();
        } catch (error) {
            toast.error(error?.response?.data.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchStores()
    }, [user])

    return !loading ? (
        <div className="text-slate-600 mb-28">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    {/* <h1 className="text-3xl font-semibold text-slate-800 flex items-center gap-2">
                        Approve Stores
                    </h1> */}
                    <h1 className="text-2xl font-semibold text-primary">
                        Approve <span className="text-customBlack">Stores</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Review pending store applications and manage approvals.
                    </p>
                </div>
            </div>

            {/* Store List */}
            {stores.length ? (
                <div className="flex flex-col gap-5 mt-6">
                    {stores.map((store) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4 max-w-4xl"
                        >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions at the bottom */}
                            <div className="flex gap-3 pt-2 flex-wrap md:justify-end">
                                <button
                                    onClick={() =>
                                        toast.promise(
                                            handleApprove({ storeId: store.id, status: 'approved' }),
                                            { loading: "Approving..." }
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium shadow-sm"
                                >
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() =>
                                        toast.promise(
                                            handleApprove({ storeId: store.id, status: 'rejected' }),
                                            { loading: 'Rejecting...' }
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                    <Building2 className="w-12 h-12 text-slate-400 mb-3" />
                    <h2 className="text-2xl font-medium text-slate-400">
                        No Applications Pending
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        All stores have been reviewed.
                    </p>
                </div>
            )}
        </div>
    ) : (
        <Loading />
    )
}
