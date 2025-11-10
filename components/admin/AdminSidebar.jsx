'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useUser } from "@clerk/nextjs"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"

const AdminSidebar = () => {
    const { user } = useUser()
    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
    ]

    if (!user) return null

    return (
        <aside
            className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60"
            role="navigation"
            aria-label="Admin dashboard sidebar navigation"
        >
            {/* Admin Info Section */}
            <div
                className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden"
                aria-label="Admin profile section"
            >
                <Image
                    className="w-14 h-14 rounded-full shadow-md"
                    src={user.imageUrl}
                    alt={`${user?.fullName || "Admin"} profile picture`}
                    width={80}
                    height={80}
                />
                <p
                    className="text-slate-700 font-medium text-center"
                    aria-live="polite"
                >
                    {user?.fullName || "Admin User"}
                </p>
            </div>

            {/* Sidebar Navigation Links */}
            <nav
                className="flex flex-col"
                role="menu"
                aria-label="Admin navigation links"
            >
                {sidebarLinks.map((link, index) => {
                    const isActive = pathname === link.href
                    const Icon = link.icon
                    return (
                        <Link
                            key={index}
                            href={link.href}
                            title={link.name}
                            role="menuitem"
                            aria-current={isActive ? "page" : undefined}
                            className={`relative flex items-center gap-3 text-slate-600 hover:bg-slate-50 p-2.5 transition focus:outline-none ${isActive ? 'bg-slate-100 sm:text-slate-700' : ''
                                }`}
                        >
                            <Icon
                                size={18}
                                className="sm:ml-5"
                                aria-hidden="true"
                            />
                            <span className="max-sm:hidden">{link.name}</span>

                            {/* Active indicator bar */}
                            {isActive && (
                                <span
                                    className="absolute bg-primary right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"
                                    aria-hidden="true"
                                ></span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default AdminSidebar
