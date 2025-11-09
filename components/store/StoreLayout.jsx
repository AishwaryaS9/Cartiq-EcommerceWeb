'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { ArrowRightIcon } from "lucide-react"
import Loading from "../Loading"
import SellerNavbar from "./StoreNavbar"
import SellerSidebar from "./StoreSidebar"

const StoreLayout = ({ children }) => {

    const { getToken } = useAuth()

    const [isSeller, setIsSeller] = useState(false)
    const [loading, setLoading] = useState(true)
    const [storeInfo, setStoreInfo] = useState(null)

    const fetchIsSeller = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/store/is-seller', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setIsSeller(data.isSeller)
            setStoreInfo(data.storeInfo)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsSeller()
    }, [])

    return loading ? (
        <Loading aria-label="Loading seller dashboard..." />
    ) : isSeller ? (
        <div className="flex flex-col h-screen" role="main" aria-labelledby="seller-dashboard-heading">
            {/* Navbar */}
            <SellerNavbar aria-label="Seller navigation bar" />
            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar" role="region" aria-label="Seller dashboard main section">
                {/* Sidebar */}
                <aside
                    role="complementary"
                    aria-label="Seller sidebar navigation"
                    className="h-full"
                >
                    <SellerSidebar storeInfo={storeInfo} />
                </aside>

                {/* Children content */}
                <main
                    id="seller-dashboard-heading"
                    tabIndex={-1}
                    className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll"
                    aria-label="Dashboard content area"
                >
                    {children}
                </main>
            </div>
        </div>
    ) : (
        <section
            role="alert"
            aria-live="polite"
            className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        >
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400" aria-label="Unauthorized access message">
                You are not authorized to access this page
            </h1>
            <Link
                href="/"
                aria-label="Go back to homepage"
                className="bg-primary text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            >
                Go to home <ArrowRightIcon size={18} aria-hidden="true" />
            </Link>
        </section>
    )
}

export default StoreLayout
