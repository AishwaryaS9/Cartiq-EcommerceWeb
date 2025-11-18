'use client'
import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { XIcon, CheckCircle2 } from 'lucide-react';
import { fetchStore } from '@/lib/features/store/storeSlice';

export default function PaymentSuccess() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(true);

    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);

    const order = useSelector((state) => state.order.currentOrder);

    useEffect(() => {
        if (!order?.items?.length) return;

        const usernames = Array.from(
            new Set(order.items.map(i => i.store?.username).filter(Boolean))
        );

        usernames.forEach(u => dispatch(fetchStore(u)));
    }, [order, dispatch]);

    useEffect(() => {
        if (!showModal) return;

        closeButtonRef.current?.focus();

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
            if (e.key === 'Escape') handleClose();
        };

        document.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escClose);

        return () => {
            document.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', escClose);
        };
    }, [showModal]);

    const safe = (v) => (v ? String(v) : '');
    const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

    const subtotal = order?.items?.reduce(
        (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
        0
    ) || 0;

    const discount = order?.coupon
        ? (subtotal * (order.coupon.discount || 0)) / 100
        : 0;

    const gst = subtotal * 0.18;
    const total = subtotal - discount + gst;

    /** ------------------------------
     * Invoice PDF
     * ------------------------------*/
    const downloadInvoice = () => {
        if (!order) {
            toast.error('No order data found.');
            return;
        }

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        let y = margin;

        const line = (yPos) => {
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
        };

        /** HEADER */
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Tax Invoice / Bill of Supply / Cash Memo', margin, y);
        doc.setFontSize(9);
        doc.text('(Original for Recipient)', margin, y + 12);

        y += 25;
        line(y);

        /** SELLER INFO */
        y += 15;
        doc.setFont('Helvetica', 'bold');
        doc.text('Sold By :', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.text('Cartiq — Shopping Made Simple', margin, y + 15);
        doc.text('794 Francisco, 94102', margin, y + 28);
        doc.text('PAN No: AACCR1234X', margin, y + 41);
        doc.text('GST Registration No: 29AACCR1234X1Z7', margin, y + 54);

        /** ORDER INFO */
        const orderDate = order.timestamp
            ? new Date(order.timestamp).toLocaleDateString()
            : new Date().toLocaleDateString();

        y += 80;
        doc.setFont('Helvetica', 'bold');
        doc.text('Order Date:', margin, y);

        doc.setFont('Helvetica', 'normal');
        doc.text(orderDate, margin, y + 15);
        line(y + 25);

        /** ADDRESSES */
        const addr = order.address || {};

        y += 40;
        doc.setFont('Helvetica', 'bold');
        doc.text('Billing Address:', margin, y);
        doc.text('Shipping Address:', margin + 250, y);

        doc.setFont('Helvetica', 'normal');
        const lines = [
            safe(addr.name),
            safe(addr.street),
            `${safe(addr.city)}, ${safe(addr.state)}, ${safe(addr.zip)}`,
            safe(addr.country || 'India'),
            `Phone: ${safe(addr.phone)}`,
        ];

        lines.forEach((t, i) => {
            doc.text(t, margin, y + 15 + 14 * i);
            doc.text(t, margin + 250, y + 15 + 14 * i);
        });

        y += 100;
        line(y);

        /** ITEMS TABLE */
        autoTable(doc, {
            startY: y + 20,
            head: [['Sl. No', 'Product', 'Store', 'Address', 'Price', 'Qty', 'Net', 'Tax', 'Total']],
            body: order.items.map((item, idx) => [
                idx + 1,
                safe(item.name),
                safe(item.store?.name),
                safe(item.store?.address),
                currency(item.price),
                item.quantity,
                currency(item.price * item.quantity),
                '18%',
                currency(item.price * item.quantity * 0.18),
            ]),
            styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
            headStyles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0], },
        });

        /** TOTALS */
        const finalY = doc.lastAutoTable.finalY + 20;
        line(finalY);

        autoTable(doc, {
            startY: finalY + 10,
            body: [
                ['Subtotal', currency(subtotal)],
                ...(discount ? [['Discount', `- ${currency(discount)}`]] : []),
                ['Tax (IGST 18%)', currency(gst)],
                ['Total Invoice Value', currency(total)],
            ],
            styles: { fontSize: 9, halign: 'right' },
            alternateRowStyles: {
                fillColor: [245, 245, 245],   // light gray background
                textColor: [0, 0, 0],         // black text
            },

            bodyStyles: {
                fillColor: [255, 255, 255],   // white for normal rows
                textColor: [0, 0, 0],
            },
            theme: 'plain',
        });

        /** FOOTER */
        const h = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.text('Thank you for shopping with Cartiq!', margin, h - 35);
        doc.text('Support: support@cartiq.com', margin, h - 22);

        doc.save('invoice.pdf');
        toast.success('Invoice downloaded successfully');
    };

    /** CLOSE MODAL */
    const handleClose = useCallback(() => {
        setShowModal(false);
        router.push('/orders');
    }, [router]);

    if (!showModal || !order) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            role="presentation"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-success-title"
                aria-describedby="payment-success-desc"
                className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center relative"
                ref={modalRef}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close payment success dialog"
                    ref={closeButtonRef}
                >
                    <XIcon size={22} />
                </button>

                <div className="text-center mb-6" aria-live="polite">
                    <CheckCircle2
                        className="mx-auto text-green-500"
                        size={40}
                        aria-hidden="true"
                    />

                    <h1
                        id="payment-success-title"
                        className="text-2xl font-semibold text-green-600 mt-2"
                    >
                        Payment Successful!
                    </h1>

                    <p id="payment-success-desc" className="text-gray-500">
                        Your order has been placed successfully.
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={downloadInvoice}
                        className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                        aria-label="Download invoice PDF for your order"
                    >
                        Download Invoice (PDF)
                    </button>

                    <button
                        onClick={handleClose}
                        className="w-full border border-slate-300 py-2.5 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
                        aria-label="Go to your orders page"
                    >
                        Go to Orders
                    </button>
                </div>
            </section>
        </div>
    );
}
