'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(true);

    const downloadInvoice = () => {
        const doc = new jsPDF();
        doc.text("Payment Successful - Invoice", 20, 20);
        doc.text("Thank you for your purchase!", 20, 30);
        doc.save("invoice.pdf");
        toast.success("Invoice downloaded");
    };


    const handleClose = () => {
        setShowModal(false);
        router.push("/orders");
    };

    return showModal ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                <h2 className="text-2xl font-semibold text-green-600">🎉 Payment Successful!</h2>
                <p className="mt-2 text-gray-500">Your order has been placed successfully.</p>

                <button
                    onClick={downloadInvoice}
                    className="mt-4 w-full bg-primary text-white py-2.5 rounded hover:bg-primary/90"
                >
                    Download Invoice
                </button>

                <button
                    onClick={handleClose}
                    className="mt-3 w-full border border-slate-300 py-2.5 rounded hover:bg-slate-100"
                >
                    Go to Orders
                </button>
            </div>
        </div>
    ) : null;
}
