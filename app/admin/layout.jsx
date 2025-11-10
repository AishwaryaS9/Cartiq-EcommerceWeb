import { SignedIn, SignIn, SignedOut } from "@clerk/nextjs"
import AdminLayout from "@/components/admin/AdminLayout"

export const metadata = {
    title: "Cartiq. - Admin Dashboard",
    description: "Cartiq. Admin Dashboard — Manage stores, approvals, and coupons seamlessly.",
}

export default function RootAdminLayout({ children }) {
    return (
        <>
            {/* Authenticated Admin Area */}
            <SignedIn>
                <main
                    className="min-h-screen bg-white text-slate-800 flex flex-col"
                    role="main"
                    aria-label="Admin dashboard main content"
                >
                    <AdminLayout>
                        {children}
                    </AdminLayout>
                </main>
            </SignedIn>

            {/* Unauthenticated / Sign-in View */}
            <SignedOut>
                <section
                    className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center"
                    role="region"
                    aria-label="Admin sign-in section"
                >
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-700 mb-4">
                        Welcome to <span className="text-primary">Cartiq Admin</span>
                    </h1>
                    <p className="text-slate-600 mb-6 max-w-md">
                        Please sign in to access your admin dashboard.
                    </p>
                    <div
                        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-md"
                        aria-label="Admin login form"
                    >
                        <SignIn
                            fallbackRedirectUrl="/admin"
                            routing="hash"
                            appearance={{
                                elements: {
                                    formButtonPrimary: "bg-primary hover:bg-primary/90",
                                },
                            }}
                        />
                    </div>
                </section>
            </SignedOut>
        </>
    )
}
