'use client'
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"

const StoreNavbar = () => {
    const { user } = useUser()

    return (
        <nav
            className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 border-b border-slate-200 transition-all flex-wrap"
            role="navigation"
            aria-label="Seller store navigation bar">
            {/* Brand Logo */}
            <Link
                href="/"
                aria-label="Go to Cartiq home page"
                className="relative text-3xl sm:text-4xl font-semibold text-slate-700 focus:outline-none">
                <span className="text-primary">Cartiq</span>
                <span className="text-customBlack text-4xl leading-0">.</span>

                {/* Store Badge */}
                <p
                    className="absolute text-xs font-semibold -top-1 -right-10 sm:-right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-primary/80"
                    aria-hidden="true">
                    Store
                </p>
            </Link>

            {/* User section */}
            <div
                className="flex items-center gap-3 mt-2 sm:mt-0"
                role="group"
                aria-label="User account menu"
            >
                <p className="hidden sm:block text-slate-700" aria-live="polite">
                    Hi, {user?.firstName || "Guest"}
                </p>
                <div aria-label="User account options" className="shrink-0">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    )
}

export default StoreNavbar
