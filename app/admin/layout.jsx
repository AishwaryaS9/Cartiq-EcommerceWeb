import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignIn, SignedOut } from "@clerk/nextjs";

export const metadata = {
    title: "Cartiq. - Admin",
    description: "Cartiq. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <SignedIn>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/admin" routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}
