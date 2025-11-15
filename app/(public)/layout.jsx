'use client'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { useAuth, useUser } from "@clerk/nextjs";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";
import { fetchFavorites, resetFavorites } from "@/lib/features/favorites/favoritesSlice";
import { fetchOrderSummary } from "@/lib/features/order/orderSlice";

export default function PublicLayout({ children }) {
    const dispatch = useDispatch();
    const { user } = useUser();
    const { getToken } = useAuth();
    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchProducts({}));
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart({ getToken }));
            dispatch(fetchAddress({ getToken }));
            dispatch(fetchUserRatings({ getToken }));
            dispatch(fetchFavorites({ getToken }));
            dispatch(fetchOrderSummary({ getToken }))
        } else {
            dispatch(resetFavorites());
        }
    }, [user, dispatch, getToken]);

    useEffect(() => {
        if (user) {
            dispatch(uploadCart({ getToken }));
        }
    }, [cartItems, user, dispatch, getToken]);

    return (
        <>
            <Head>
                <title>Cartiq — Shopping Made Simple</title>
                <meta
                    name="description"
                    content="Discover Cartiq — your all-in-one online shopping destination for fashion, home essentials, gadgets, beauty, and more. Great deals and top-quality products in every category."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="Cartiq — Shopping Made Simple" />
                <meta
                    property="og:description"
                    content="Shop thousands of products across all categories at Cartiq. Fast delivery, secure checkout, and exclusive deals."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://cartiq.com" />
                <meta property="og:image" content="/og-image.png" />
            </Head>

            <div className="flex flex-col min-h-screen bg-white text-slate-800 relative z-50">
                <header role="banner" aria-label="Promotional and site navigation" className="bg-white sticky top-0 z-50">
                    <Banner />
                    <Navbar />
                </header>

                <main
                    id="main-content"
                    role="main"
                    tabIndex={-1}
                    className="flex-grow focus:outline-none"
                    aria-label="Page content"
                >
                    {children}
                </main>

                <footer role="contentinfo" aria-label="Website footer">
                    <Footer />
                </footer>
            </div>
        </>
    );
}
