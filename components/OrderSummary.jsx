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
    const addressList = useSelector(state => state.address.list);

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

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
                paymentMethod
            };
            if (coupon) orderData.couponCode = coupon.code;

            const { data } = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (paymentMethod === 'STRIPE') {
                window.location.href = data.session.url;
            } else {
                toast.success(data.message);
                router.push('/orders');
                dispatch(fetchCart({ getToken }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message);
        }
    };

    return (
        <aside
            className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7"
            aria-labelledby="order-summary-title"
            role="complementary"
        >
            <h2
                id="order-summary-title"
                className="text-xl font-medium text-slate-600"
            >
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
                    <div
                        className="flex gap-2 items-center"
                        aria-label="Selected address"
                    >
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
                            <label htmlFor="address-select" className="sr-only">
                                Select Address
                            </label>
                        )}
                        {addressList.length > 0 && (
                            <select
                                id="address-select"
                                className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                                onChange={(e) =>
                                    setSelectedAddress(addressList[e.target.value])
                                }
                                aria-label="Select delivery address"
                            >
                                <option value="">Select Address</option>
                                {addressList.map((address, index) => (
                                    <option key={index} value={index}>
                                        {address.name}, {address.city}, {address.state},{' '}
                                        {address.zip}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button
                            type="button"
                            className="flex items-center gap-1 text-slate-600 mt-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded"
                            onClick={() => setShowAddressModal(true)}
                            aria-label="Add new address"
                        >
                            Add Address <PlusIcon size={18} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </section>

            {/* Summary Section */}
            <section
                className="pb-4 border-b border-slate-200"
                aria-labelledby="summary-details"
            >
                <h3 id="summary-details" className="sr-only">
                    Order details
                </h3>
                <div className="flex justify-between" role="table">
                    <div
                        className="flex flex-col gap-1 text-slate-400"
                        role="rowgroup"
                        aria-hidden="true"
                    >
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className="flex flex-col gap-1 font-medium text-right">
                        <p aria-label={`Subtotal ${currency}${totalPrice.toLocaleString()}`}>
                            {currency}
                            {totalPrice.toLocaleString()}
                        </p>
                        <p aria-label="Shipping cost">
                            <Protect plan="plus" fallback={`${currency}5`}>
                                Free
                            </Protect>
                        </p>
                        {coupon && (
                            <p
                                aria-label={`Discount ${currency}${(
                                    (coupon.discount / 100) *
                                    totalPrice
                                ).toFixed(2)}`}
                            >
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
                            toast.promise(handleCouponCode(e), {
                                loading: 'Checking Coupon...'
                            })
                        }
                        className="flex justify-center gap-3 mt-3"
                        aria-label="Apply coupon code form"
                    >
                        <label htmlFor="coupon-input" className="sr-only">
                            Coupon Code
                        </label>
                        <input
                            id="coupon-input"
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                            value={couponCodeInput}
                            type="text"
                            placeholder="Coupon Code"
                            className="border border-slate-400 p-1.5 rounded w-full outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
                        >
                            Apply
                        </button>
                    </form>
                ) : (
                    <div
                        className="w-full flex items-center justify-center gap-2 text-xs mt-2"
                        aria-label={`Coupon applied: ${coupon.code.toUpperCase()}`}
                    >
                        <p>
                            Code:{' '}
                            <span className="font-semibold ml-1">
                                {coupon.code.toUpperCase()}
                            </span>
                        </p>
                        <p>{coupon.description}</p>
                        <button
                            type="button"
                            onClick={() => setCoupon('')}
                            aria-label="Remove coupon code"
                            className="hover:text-red-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 rounded"
                        >
                            <XIcon size={18} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </section>

            {/* Total */}
            <div
                className="flex justify-between py-4"
                aria-label="Total amount summary"
            >
                <p>Total:</p>
                <p className="font-medium text-right">
                    <Protect
                        plan="plus"
                        fallback={`${currency}${coupon
                            ? (totalPrice + 5 - (coupon.discount / 100) * totalPrice).toFixed(
                                2
                            )
                            : (totalPrice + 5).toLocaleString()
                            }`}
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
                className="w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
            >
                Place Order
            </button>

            {showAddressModal && (
                <AddressModal setShowAddressModal={setShowAddressModal} />
            )}
        </aside>
    );
};

export default OrderSummary;
