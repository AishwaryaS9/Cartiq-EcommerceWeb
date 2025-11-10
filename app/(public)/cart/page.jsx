'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2Icon } from "lucide-react";
import Counter from "@/components/Counter";
import PageTitle from "@/components/PageTitle";
import OrderSummary from "@/components/OrderSummary";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";

export default function Cart() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();
    const router = useRouter();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const updatedCartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                updatedCartArray.push({
                    ...product,
                    quantity: value,
                });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(updatedCartArray);
    };

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }));
    };

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return (
        <main
            className="min-h-[70vh] mx-4 sm:mx-6 md:mx-8"
            role="main"
            aria-label="Shopping cart page">
            <div className="max-w-7xl mx-auto">
                <PageTitle
                    heading="My"
                    highlight="Cart"
                    text="Items in your cart"
                    path="/shop"
                    linkText="Add more"
                />

                {cartArray.length > 0 ? (
                    <main
                        className="min-h-screen mx-6 text-slate-800"
                        aria-label="Shopping cart page"
                    >
                        <section
                            className="flex items-start justify-between gap-10 max-lg:flex-col"
                            aria-labelledby="cart-items-section"
                        >
                            <h2 id="cart-items-section" className="sr-only">
                                Cart items list
                            </h2>
                            <div className="w-full overflow-x-auto">
                                <table
                                    className="w-full max-w-4xl text-slate-600 table-auto"
                                    role="table"
                                    aria-label="Shopping cart items"
                                >
                                    <thead className="border-b border-slate-200">
                                        <tr className="max-sm:text-sm">
                                            <th scope="col" className="text-left p-2">
                                                Product
                                            </th>
                                            <th scope="col" className="p-2">
                                                Quantity
                                            </th>
                                            <th scope="col" className="p-2">
                                                Total Price
                                            </th>
                                            <th
                                                scope="col"
                                                className="max-md:hidden p-2"
                                            >
                                                Remove
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartArray.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="space-x-2 border-b border-slate-100"
                                                role="row"
                                                aria-label={`${item.name} cart item`}
                                            >
                                                <td className="flex gap-3 my-4 items-center">
                                                    <Link href={`/product/${item.id}`} aria-label={`View details for ${item.name}`}>
                                                        <div className="flex items-center justify-center bg-slate-100 size-18 rounded-md">
                                                            <Image
                                                                src={item.images[0]}
                                                                alt={`${item.name} product image`}
                                                                width={45}
                                                                height={45}
                                                                className="h-14 w-auto object-contain"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </Link>
                                                    <div>
                                                        <p className="max-sm:text-sm font-medium text-slate-700">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {item.category}
                                                        </p>
                                                        <p aria-label={`Unit price ${currency}${item.price}`}>
                                                            {currency}
                                                            {item.price}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td
                                                    className="text-center align-middle"
                                                    aria-label={`Quantity for ${item.name}`}
                                                >
                                                    <Counter productId={item.id} />
                                                </td>
                                                <td
                                                    className="text-center align-middle font-medium"
                                                    aria-label={`Total for ${item.name} is ${currency}${(
                                                        item.price * item.quantity
                                                    ).toLocaleString()}`}
                                                >
                                                    {currency}
                                                    {(item.price * item.quantity).toLocaleString()}
                                                </td>
                                                <td className="text-center max-md:hidden align-middle">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteItemFromCart(item.id)
                                                        }
                                                        aria-label={`Remove ${item.name} from cart`}
                                                        className="text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                                                    >
                                                        <Trash2Icon
                                                            size={18}
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <aside
                                aria-label="Order summary"
                                className="flex-shrink-0"
                            >
                                <OrderSummary
                                    totalPrice={totalPrice}
                                    items={cartArray}
                                />
                            </aside>
                        </section>
                    </main>
                ) : (
                    <div
                        className="text-center py-16 text-slate-700"
                        role="region"
                        aria-label="Empty cart message">
                        <p className="text-lg" tabIndex={0}>
                            Your cart is empty.
                        </p>
                        <button
                            onClick={() => router.push('/shop')}
                            className="mt-6 bg-primary font-medium text-white px-5 py-2 rounded-md hover:bg-primary/90 transition"
                            aria-label="Browse products in the shop"
                        >
                            Browse Products
                        </button>

                    </div>
                )}
            </div>
        </main>
    )
}
