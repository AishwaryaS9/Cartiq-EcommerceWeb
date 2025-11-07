'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser, useAuth } from "@clerk/nextjs"
import axios from "axios"
import { ArrowRightIcon } from "lucide-react"
import Loading from "../Loading"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ children }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsAdmin(data.isAdmin);
        } catch (error) {
            console.error("Error fetching admin status:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchIsAdmin()
        }
    }, [user]);

    if (loading) return <Loading aria-label="Loading admin interface" role="status" />;

    if (!isAdmin) {
        return (
            <main
                className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50 dark:bg-slate-900"
                role="main"
                aria-labelledby="unauthorized-heading"
            >
                <h1
                    id="unauthorized-heading"
                    className="text-2xl sm:text-4xl font-semibold text-slate-700 dark:text-slate-300"
                >
                    You are not authorized to access this page
                </h1>

                <Link
                    href="/"
                    aria-label="Return to homepage"
                    className="bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-2 mt-8 p-3 px-6 text-sm sm:text-base rounded-full transition-colors duration-200"
                >
                    Go to home <ArrowRightIcon size={18} aria-hidden="true" />
                </Link>
            </main>
        )
    }

    return (
        <div className="flex flex-col h-screen" role="application" aria-label="Admin Dashboard Layout">
            <AdminNavbar aria-label="Admin navigation bar" />

            <div className="flex flex-1 items-start h-full overflow-y-auto no-scrollbar">
                <AdminSidebar aria-label="Sidebar navigation menu" />

                <main
                    className="flex-1 h-full p-4 sm:p-6 lg:pl-12 lg:pt-12 overflow-y-auto"
                    role="main"
                    aria-label="Admin content area"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
