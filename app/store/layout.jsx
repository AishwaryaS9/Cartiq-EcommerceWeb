import StoreLayout from "@/components/store/StoreLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export const metadata = {
    title: "Cartiq - Store Dashboard",
    description: "Cartiq. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    const baseUrl = process.env.NEXT_PUBLIC_CLERK_BASE_URL

    return (
        <>
            <SignedIn>
                <StoreLayout>
                    {children}
                </StoreLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex  items-center justify-center">
                    <SignIn redirectUrlComplete={`${baseUrl}/store`} routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}
