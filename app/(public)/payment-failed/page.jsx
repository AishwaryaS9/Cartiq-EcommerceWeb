'use client'
import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentFailed() {
    const router = useRouter();

    const modalRef = useRef(null);
    const firstButtonRef = useRef(null);

    useEffect(() => {
        firstButtonRef.current?.focus();

        const trapFocus = (e) => {
            if (!modalRef.current) return;

            const focusable = modalRef.current.querySelectorAll(
                'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        const escClose = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escClose);

        return () => {
            document.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', escClose);
        };
    }, []);

    const closeModal = useCallback(() => {
        router.push('/orders');
    }, [router]);

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            role="presentation"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-failed-title"
                aria-describedby="payment-failed-desc"
                ref={modalRef}
                className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center"
            >
                <h1
                    id="payment-failed-title"
                    className="text-2xl font-semibold text-red-600"
                >
                    {"\u274C"} Payment Failed
                </h1>

                <p
                    id="payment-failed-desc"
                    className="mt-2 text-gray-500"
                    aria-live="polite"
                >
                    Something went wrong with your payment.
                </p>

                <button
                    onClick={closeModal}
                    ref={firstButtonRef}
                    aria-label="Go to your orders page"
                    className="mt-4 w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90"
                >
                    Go to Orders
                </button>
            </section>
        </div>
    );
}
