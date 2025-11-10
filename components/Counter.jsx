'use client'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { toast } from "react-hot-toast";

const Counter = ({ productId, stockQuantity }) => {
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const currentQuantity = cartItems[productId] || 0;

    const addToCartHandler = () => {
        // Prevent adding more than available stock
        if (stockQuantity && currentQuantity >= stockQuantity) {
            toast.error(`Only ${stockQuantity} item${stockQuantity > 1 ? 's' : ''} in stock`);
            return;
        }
        dispatch(addToCart({ productId }));
    };

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }));
    };

    if (stockQuantity === 0) {
        return <p className="text-red-500 text-sm">Out of stock</p>;
    }

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
                disabled={currentQuantity <= 0}
            >
                <span aria-hidden="true">−</span>
            </button>

            <p
                className="p-1 min-w-[1.5rem] text-center select-none"
                role="status"
                aria-live="polite"
                aria-label={`Quantity: ${currentQuantity}`}
            >
                {currentQuantity}
            </p>

            <button
                onClick={addToCartHandler}
                aria-label="Increase quantity"
                title="Increase quantity"
                className={`p-1 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded transition ${currentQuantity >= stockQuantity ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                type="button"
                disabled={currentQuantity >= stockQuantity}
            >
                <span aria-hidden="true">+</span>
            </button>
        </div>
    );
};

export default Counter;
