'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Protect, useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import AddressModal from './AddressModal';
import { fetchCart } from '@/lib/features/cart/cartSlice';


const OrderSummary = ({ totalPrice, items }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();
    const addressList = useSelector((state) => state.address.list);

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        try {
            if (!user) return toast('Please login to proceed');
            const token = await getToken();
            const { data } = await axios.post(
                '/api/coupon',
                { code: couponCodeInput },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCoupon(data.coupon);
            toast.success('Coupon Applied');
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            if (!user) return toast('Please login to place an order');
            if (!selectedAddress) return toast('Please select an address');

            const token = await getToken();
            const orderData = {
                addressId: selectedAddress.id,
                items,
                paymentMethod,
            };
            if (coupon) orderData.couponCode = coupon.code;

            const { data } = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (paymentMethod === 'STRIPE') {
                // Stripe will redirect automatically to success/cancel URLs
                window.location.href = data.session.url;
            } else {
                // COD flow: show invoice modal
                toast.success(data.message);
                dispatch(fetchCart({ getToken }));
                setShowInvoiceModal(true);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.error || error?.message);
            setShowErrorModal(true);
        }
    };


    return (
        <>
            <aside
                className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7"
                aria-labelledby="order-summary-title"
                role="complementary"
            >
                <h2 id="order-summary-title" className="text-xl font-medium text-slate-600">
                    Payment Summary
                </h2>

                {/* Payment Method */}
                <fieldset className="mt-4" aria-label="Payment method selection">
                    <legend className="text-slate-400 text-xs mb-2">Payment Method</legend>

                    <div className="flex gap-2 items-center">
                        <input
                            type="radio"
                            id="COD"
                            name="payment"
                            value="COD"
                            onChange={() => setPaymentMethod('COD')}
                            checked={paymentMethod === 'COD'}
                            className="accent-gray-500 cursor-pointer"
                        />
                        <label htmlFor="COD" className="cursor-pointer select-none">
                            Cash on Delivery (COD)
                        </label>
                    </div>

                    <div className="flex gap-2 items-center mt-1">
                        <input
                            type="radio"
                            id="STRIPE"
                            name="payment"
                            value="STRIPE"
                            onChange={() => setPaymentMethod('STRIPE')}
                            checked={paymentMethod === 'STRIPE'}
                            className="accent-gray-500 cursor-pointer"
                        />
                        <label htmlFor="STRIPE" className="cursor-pointer select-none">
                            Stripe Payment
                        </label>
                    </div>
                </fieldset>

                {/* Address Section */}
                <section
                    className="my-4 py-4 border-y border-slate-200 text-slate-400"
                    aria-labelledby="address-section"
                >
                    <h3 id="address-section" className="sr-only">
                        Shipping Address
                    </h3>
                    <p className="font-medium text-slate-500 mb-2">Address</p>

                    {selectedAddress ? (
                        <div className="flex gap-2 items-center" aria-label="Selected address">
                            <p>
                                {selectedAddress.name}, {selectedAddress.city},{' '}
                                {selectedAddress.state}, {selectedAddress.zip}
                            </p>
                            <button
                                type="button"
                                onClick={() => setSelectedAddress(null)}
                                aria-label="Change selected address"
                                className="cursor-pointer p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                            >
                                <SquarePenIcon size={18} aria-hidden="true" />
                            </button>
                        </div>
                    ) : (
                        <div>
                            {addressList.length > 0 && (
                                <select
                                    id="address-select"
                                    className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                                    onChange={(e) => setSelectedAddress(addressList[e.target.value])}
                                    aria-label="Select delivery address"
                                >
                                    <option value="">Select Address</option>
                                    {addressList.map((address, index) => (
                                        <option key={index} value={index}>
                                            {address.name}, {address.city}, {address.state}, {address.zip}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <button
                                type="button"
                                className="flex items-center gap-1 text-slate-600 mt-1 hover:underline"
                                onClick={() => setShowAddressModal(true)}
                                aria-label="Add new address"
                            >
                                Add Address <PlusIcon size={18} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </section>

                {/* Summary Section */}
                <section className="pb-4 border-b border-slate-200">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-1 text-slate-400">
                            <p>Subtotal:</p>
                            <p>Shipping:</p>
                            {coupon && <p>Coupon:</p>}
                        </div>
                        <div className="flex flex-col gap-1 font-medium text-right">
                            <p>{currency}{totalPrice.toLocaleString()}</p>
                            <p>
                                <Protect plan="plus" fallback={`${currency}5`}>
                                    Free
                                </Protect>
                            </p>
                            {coupon && (
                                <p>
                                    -{currency}
                                    {(coupon.discount / 100 * totalPrice).toFixed(2)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Coupon Input */}
                    {!coupon ? (
                        <form
                            onSubmit={(e) =>
                                toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })
                            }
                            className="flex justify-center gap-3 mt-3"
                        >
                            <input
                                onChange={(e) => setCouponCodeInput(e.target.value)}
                                value={couponCodeInput}
                                type="text"
                                placeholder="Coupon Code"
                                className="border border-slate-400 p-1.5 rounded w-full outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-3 rounded hover:bg-primary/90 active:scale-95 transition-all"
                            >
                                Apply
                            </button>
                        </form>
                    ) : (
                        <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
                            <p>
                                Code: <span className="font-semibold ml-1">{coupon.code.toUpperCase()}</span>
                            </p>
                            <p>{coupon.description}</p>
                            <button
                                type="button"
                                onClick={() => setCoupon('')}
                                aria-label="Remove coupon code"
                                className="hover:text-red-700 transition cursor-pointer"
                            >
                                <XIcon size={18} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </section>

                {/* Total */}
                <div className="flex justify-between py-4">
                    <p>Total:</p>
                    <p className="font-medium text-right">
                        <Protect
                            plan="plus"
                            fallback={`${currency}${coupon
                                ? (totalPrice + 5 - (coupon.discount / 100) * totalPrice).toFixed(2)
                                : (totalPrice + 5).toLocaleString()}`}
                        >
                            {currency}
                            {coupon
                                ? (totalPrice - (coupon.discount / 100) * totalPrice).toFixed(2)
                                : totalPrice.toLocaleString()}
                        </Protect>
                    </p>
                </div>

                {/* Place Order */}
                <button
                    type="button"
                    onClick={(e) =>
                        toast.promise(handlePlaceOrder(e), { loading: 'Placing Order...' })
                    }
                    aria-label="Place your order"
                    className="w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90 active:scale-95 transition-all"
                >
                    Place Order
                </button>

                {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
            </aside>

            {/* COD Success Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                        <h2 className="text-2xl font-semibold text-green-600">🎉 Order Placed!</h2>
                        <p className="mt-2 text-gray-500">Your COD order has been placed successfully.</p>

                        <button
                            // onClick={downloadInvoice}
                            className="mt-4 w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90"
                        >
                            Download Invoice
                        </button>

                        <button
                            onClick={() => {
                                setShowInvoiceModal(false);
                                router.push('/orders');
                            }}
                            className="mt-3 w-full border border-slate-300 py-2.5 rounded hover:bg-slate-100"
                        >
                            Go to Orders
                        </button>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                        <h2 className="text-2xl font-semibold text-red-600">❌ Payment Failed</h2>
                        <p className="mt-2 text-gray-500">Something went wrong with your payment.</p>
                        <button
                            onClick={() => {
                                setShowErrorModal(false);
                                router.push('/orders');
                            }}
                            className="mt-4 w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90"
                        >
                            Go to Orders
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderSummary;
