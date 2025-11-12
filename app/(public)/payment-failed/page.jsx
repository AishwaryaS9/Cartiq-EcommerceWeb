'use client';
import { useRouter } from 'next/navigation';

export default function PaymentFailed() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                <h2 className="text-2xl font-semibold text-red-600">❌ Payment Failed</h2>
                <p className="mt-2 text-gray-500">Something went wrong with your payment.</p>

                <button
                    onClick={() => router.push('/orders')}
                    className="mt-4 w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90"
                >
                    Go to Orders
                </button>
            </div>
        </div>
    );
}
