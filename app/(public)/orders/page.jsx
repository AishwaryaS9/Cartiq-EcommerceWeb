
'use client'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import PageTitle from "@/components/PageTitle"
import Loading from "@/components/Loading";
import OrderItem from "@/components/OrderItem";
import Pagination from "@/components/Pagination";

export default function Orders() {
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1)

    const orderSummary = useSelector((state) => state.order.currentOrder);

    const ordersPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get('/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(data.orders);
                setLoading(false);
            } catch (error) {
                toast.error(error?.response?.data?.error || error.message);
            }
        };

        if (isLoaded) {
            user ? fetchOrders() : router.push('/');
        }
    }, [isLoaded, user, getToken, router]);

    // Pagination logic
    const indexOfLastProduct = currentPage * ordersPerPage
    const indexOfFirstProduct = indexOfLastProduct - ordersPerPage
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(orders.length / ordersPerPage)

    if (!isLoaded || loading) return <Loading aria-label="Loading your orders..." />;

    if (!orderSummary) return <p className="text-center text-lg mt-10">No order found.</p>;


    return (
        <main className="min-h-[70vh] px-4 sm:px-6 lg:px-8" role="main" aria-labelledby="orders-heading">
            <div className="max-w-7xl mx-auto">
                <PageTitle
                    heading="My"
                    highlight="Orders"
                    text={`Showing total ${orders.length} orders`}
                    path="/"
                    linkText="Go to home"
                />

                {currentOrders.length > 0 ? (
                    <section className="max-w-7xl mx-auto mt-6" aria-live="polite" aria-label="Your Orders">
                        {/* Responsive Orders Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-slate-600 table-auto border-separate border-spacing-y-6">
                                <thead className="hidden md:table-header-group">
                                    <tr className="text-sm lg:text-base text-slate-700">
                                        <th className="text-left p-2 w-[40%]">Product</th>
                                        <th className="text-left p-2 w-[15%] whitespace-nowrap">Total Price</th>
                                        <th className="text-left p-2 w-[30%]">Address</th>
                                        <th className="text-left p-2 w-[10%] whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="space-y-4">
                                    {currentOrders.map((order) => (
                                        <OrderItem
                                            key={order.id}
                                            order={order}
                                            className="w-full"
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <div className="text-center py-16 text-slate-700">
                        <p className="text-lg">You have no orders.</p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                            aria-label="Browse products in the shop">
                            Browse Products
                        </button>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </main>
    );
}
