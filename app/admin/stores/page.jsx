'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

export default function AdminStores() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/admin/stores', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStores(data.stores);
        } catch (error) {
            toast.error(error?.response?.data.error || error.message);
        }
        setLoading(false);
    };

    const toggleIsActive = async (storeId) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                '/api/admin/toggle-store',
                { storeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchStores();
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data.error || error.message);
        }
    };

    useEffect(() => {
        if (user) fetchStores();
    }, [user]);

    return !loading ? (
        <div className="text-slate-600 mb-28 px-4 md:px-8">
            {/* Header */}
            <div className="mb-6 text-center md:text-left">
                {/* <h1 className="text-3xl font-semibold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                    <Building2 className="w-7 h-7 text-indigo-600" /> Live Stores
                </h1> */}
                <h1 className="text-2xl font-semibold text-primary">
                    Live <span className="text-customBlack">Stores</span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage store visibility and status
                </p>
            </div>

            {/* Store List */}
            {stores.length ? (
                <div className="flex flex-col gap-5 mt-4 ">
                    {stores.map((store) => (
                        <motion.div
                            key={store.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col gap-4 max-w-4xl w-full"
                        >
                            {/* Store Info */}
                            <StoreInfo store={store} />

                            {/* Actions at the bottom */}
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 pt-2 md:justify-end justify-between">
                                <p className="text-sm font-medium">
                                    {store.isActive ? (
                                        <span className="text-green-600">Active</span>
                                    ) : (
                                        <span className="text-rose-500">Inactive</span>
                                    )}
                                </p>
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={store.isActive}
                                        onChange={() =>
                                            toast.promise(toggleIsActive(store.id), {
                                                loading: "Updating...",
                                                success: "Status updated",
                                                error: "Failed to update",
                                            })
                                        }
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                                </label>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="bg-slate-100 p-6 rounded-full mb-4">
                        <Building2 className="w-10 h-10 text-slate-400" />
                    </div>
                    <h1 className="text-2xl text-slate-500 font-medium">No stores available</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Your active stores will appear here.
                    </p>
                </div>
            )}
        </div>
    ) : (
        <Loading />
    );
}
