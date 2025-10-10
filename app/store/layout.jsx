import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Cartiq - Store Dashboard",
    description: "Cartiq. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
