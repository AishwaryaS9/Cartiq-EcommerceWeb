'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import PageTitle from "@/components/PageTitle"
import Loading from "@/components/Loading";
import OrderItem from "@/components/OrderItem";

export default function Orders() {
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(data.orders);
                setLoading(false);
            } catch (error) {
                toast.error(error?.response?.data?.error || error.message);
            }
        };

        if (isLoaded) {
            if (user) {
                fetchOrders();
            } else {
                router.push('/');
            }
        }
    }, [isLoaded, user, getToken, router]);

    if (!isLoaded || loading) {
        return <Loading aria-label="Loading your orders..." />;
    }

    return (
        <main
            className="min-h-[70vh] mx-6"
            role="main"
            aria-labelledby="orders-heading">
            <div className="max-w-7xl mx-auto">
                <PageTitle
                    heading="My"
                    highlight="Orders"
                    text={`Showing total ${orders.length} orders`}
                    path="/"
                    linkText="Go to home"
                />

                {orders.length > 0 ? (
                    <main
                        className="min-h-screen mx-6 text-slate-800"
                        aria-label="Shopping cart page">
                        <section
                            className="max-w-7xl mx-auto"
                            aria-live="polite"
                            aria-label="Your Orders">

                            {/* Orders Table */}
                            <div className="overflow-x-auto" role="region" aria-label="Orders list">
                                <table
                                    className="w-full max-w-5xl text-slate-500 table-fixed border-separate border-spacing-y-12 border-spacing-x-4"
                                    aria-describedby="orders-table-caption">
                                    <thead className="max-md:hidden">
                                        <tr className="text-slate-600 text-sm sm:text-base">
                                            <th scope="col" className="text-left p-2 w-[45%]">Product</th>
                                            <th scope="col" className="text-left w-[15%] whitespace-nowrap">Total Price</th>
                                            <th scope="col" className="text-left p-2 w-[30%]">Address</th>
                                            <th scope="col" className="text-left p-2 w-[10%] whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {orders.map((order) => (
                                            <OrderItem
                                                key={order.id}
                                                order={order}
                                                aria-label={`Order ID ${order.id}`}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </main>
                ) : (
                    <div
                        className="text-center py-16 text-slate-700"
                        role="region"
                        aria-label="No orders message">
                        <p className="text-lg" tabIndex={0}>
                            You have no orders.
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                            aria-label="Browse products in the shop">
                            Browse Products
                        </button>
                    </div>
                )}
            </div>
        </main >
    );


}
