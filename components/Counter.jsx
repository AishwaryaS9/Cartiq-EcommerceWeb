'use client'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";

const Counter = ({ productId }) => {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }));
    };

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }));
    };

    return (
        <div
            className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600"
            role="group"
            aria-label="Product quantity selector"
        >
            <button
                onClick={removeFromCartHandler}
                aria-label="Decrease quantity"
                title="Decrease quantity"
                className="p-1 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded transition"
                type="button"
            >
                <span aria-hidden="true">−</span>
            </button>

            <p
                className="p-1 min-w-[1.5rem] text-center select-none"
                role="status"
                aria-live="polite"
                aria-label={`Quantity: ${cartItems[productId] || 0}`}
            >
                {cartItems[productId] || 0}
            </p>

            <button
                onClick={addToCartHandler}
                aria-label="Increase quantity"
                title="Increase quantity"
                className="p-1 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded transition"
                type="button"
            >
                <span aria-hidden="true">+</span>
            </button>
        </div>
    );
};

export default Counter;
