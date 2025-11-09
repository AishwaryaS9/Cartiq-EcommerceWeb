'use client'
import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"

const AdminNavbar = () => {
    const { user } = useUser()

    return (
        <nav
            className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 border-b border-slate-200 transition-all flex-wrap"
            role="navigation"
            aria-label="Admin dashboard navigation bar"
        >
            {/* Brand Logo */}
            <Link
                href="/"
                aria-label="Go to Cartiq home page"
                className="relative text-3xl sm:text-4xl font-semibold text-slate-700 focus:outline-none"
            >
                <span className="text-primary">Cartiq</span>
                <span className="text-customBlack text-4xl leading-0">.</span>

                {/* Admin Badge */}
                <p
                    className="absolute text-xs font-semibold -top-1 -right-11 sm:-right-12 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-primary/80"
                    aria-hidden="true"
                >
                    Admin
                </p>
            </Link>

            {/* User Section */}
            <div
                className="flex items-center gap-3 mt-2 sm:mt-0"
                role="group"
                aria-label="User account menu"
            >
                <p
                    className="hidden sm:block text-slate-700"
                    aria-live="polite"
                >
                    Hi, {user?.firstName || "Admin"}
                </p>

                <div aria-label="User account options" className="shrink-0">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar
