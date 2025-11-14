'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { XIcon, CheckCircle2 } from 'lucide-react';
import { fetchStore } from '@/lib/features/store/storeSlice';

export default function PaymentSuccess() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(true);

    const dispatch = useDispatch();

    const order = useSelector((state) => state.order.currentOrder);

    useEffect(() => {
        if (!order?.items) return;

        const uniqueStoreUsernames = [
            ...new Set(
                order.items
                    .map(item => item.store?.username)
                    .filter(Boolean)
            )
        ];

        uniqueStoreUsernames.forEach(username => {
            dispatch(fetchStore(username));
        });

    }, [order, dispatch]);


    const downloadInvoice = () => {
        if (!order) {
            toast.error('No order data found.');
            return;
        }

        const safeText = (value) => (value ? String(value) : '');

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        let y = margin;

        const line = (yPos) => {
            doc.setDrawColor(180);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
        };

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('Tax Invoice / Bill of Supply / Cash Memo', margin, y);
        doc.setFontSize(9);
        doc.text('(Original for Recipient)', margin, y + 12);

        y += 25;
        line(y);

        // Seller Info
        y += 15;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Sold By :', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Branding Only, stores appear inside item table
        doc.text('Cartiq — Shopping Made Simple', margin, y + 15);
        doc.text('794 Francisco, 94102', margin, y + 28);
        doc.text('PAN No: AACCR1234X', margin, y + 41);
        doc.text('GST Registration No: 29AACCR1234X1Z7', margin, y + 54);

        // Invoice Info
        const orderDate = order.timestamp
            ? new Date(order.timestamp).toLocaleDateString()
            : new Date().toLocaleDateString();

        y += 80;
        doc.setFont('helvetica', 'bold');
        doc.text('Order Date:', margin, y);

        y += 15;
        doc.setFont('helvetica', 'normal');
        doc.text(safeText(orderDate), margin, y);
        line(y + 10);

        // Billing + Shipping
        y += 25;
        doc.setFont('helvetica', 'bold');
        doc.text('Billing Address:', margin, y);
        doc.text('Shipping Address:', margin + 250, y);

        y += 15;
        doc.setFont('helvetica', 'normal');
        const addr = order.address || {};

        const billing = [
            safeText(addr.name),
            `${addr.street || ''}`,
            `${addr.city || ''}, ${addr.state || ''}, ${addr.zip || ''}`,
            `${addr.country || 'India'}`,
            `Phone: ${addr.phone || 'N/A'}`,
        ];

        const shipping = [...billing];

        billing.forEach((lineText, i) => doc.text(lineText, margin, y + 14 * i));
        shipping.forEach((lineText, i) =>
            doc.text(lineText, margin + 250, y + 14 * i)
        );

        y += 90;
        line(y);

        // Items Table
        const items = Array.isArray(order?.items) ? order.items : [];

        const tableData = items.map((item, idx) => {
            const storeName = item.store?.name || "N/A";
            const storeAddress = item.store?.address || "N/A";

            return [
                idx + 1,
                safeText(item.name),
                safeText(storeName),
                safeText(storeAddress),
                `$${Number(item.price).toFixed(2)}`,
                item.quantity,
                `$${(item.price * item.quantity).toFixed(2)}`,
                '18%',
                `$${((item.price * item.quantity) * 0.18).toFixed(2)}`,
            ];
        });


        autoTable(doc, {
            startY: y + 20,
            head: [
                [
                    'Sl. No',
                    'Product',
                    'Store',
                    'Address',
                    'Price',
                    'Qty',
                    'Net',
                    'Tax',
                    'Total',
                ],
            ],
            body: tableData,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: null },
            bodyStyles: { fillColor: null },
            columnStyles: {
                0: { halign: 'left', cellWidth: 28 },
                1: { cellWidth: 100 },  // product
                2: { cellWidth: 70 },   // store name
                3: { cellWidth: 110 },  // address
                4: { halign: 'left', cellWidth: 45 }, // price
                5: { halign: 'left', cellWidth: 30 }, // qty
                6: { halign: 'left', cellWidth: 45 }, // net
                7: { halign: 'left', cellWidth: 35 }, // tax
                8: { halign: 'left', cellWidth: 45 }, // total
            },
            tableWidth: 'auto',
        });


        let finalY = doc.lastAutoTable.finalY + 20;
        line(finalY);

        // Totals
        const subtotal = items.reduce(
            (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
            0
        );
        const discount = order.coupon
            ? (subtotal * (order.coupon.discount || 0)) / 100
            : 0;
        const gst = subtotal * 0.18;
        const total = subtotal - discount + gst;

        autoTable(doc, {
            startY: finalY + 10,
            body: [
                ['Subtotal', `$${subtotal.toFixed(2)}`],
                ...(discount ? [['Discount', `- $${discount.toFixed(2)}`]] : []),
                ['Tax (IGST 18%)', `$${gst.toFixed(2)}`],
                ['Total Invoice Value', `$${total.toFixed(2)}`],
            ],
            styles: { fontSize: 9, halign: 'right' },
            theme: 'plain',
            columnStyles: { 0: { cellWidth: 200 } },
        });

        // Payment Info
        let infoY = doc.lastAutoTable.finalY + 25;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        doc.text(`Mode of Payment: ${safeText(order.paymentMethod)}`, margin, infoY);
        doc.text(`Transaction ID: ${safeText(order.transactionId || 'N/A')}`, margin, infoY + 15);
        doc.text(
            `Date & Time: ${safeText(
                order.timestamp
                    ? new Date(order.timestamp).toLocaleString()
                    : new Date().toLocaleString()
            )}`,
            margin,
            infoY + 30
        );
        doc.text(`Whether tax is payable under reverse charge - No`, margin, infoY + 45);

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text('Thank you for shopping with Cartiq!', margin, pageHeight - 35);
        doc.text('For support, contact: support@cartiq.com', margin, pageHeight - 22);

        doc.save(`invoice.pdf`);
        toast.success('Invoice downloaded successfully');
    };

    const handleClose = () => {
        setShowModal(false);
        router.push('/orders');
    };

    if (!showModal || !order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center relative">

                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <XIcon size={22} />
                </button>

                <div className="text-center mb-6">
                    <CheckCircle2 className="mx-auto text-green-500" size={40} />
                    <h2 className="text-2xl font-semibold text-green-600 mt-2">
                        Payment Successful!
                    </h2>
                    <p className="text-gray-500">Your order has been placed successfully.</p>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={downloadInvoice}
                        className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                    >
                        Download Invoice (PDF)
                    </button>

                    <button
                        onClick={handleClose}
                        className="w-full border border-slate-300 py-2.5 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
                    >
                        Go to Orders
                    </button>
                </div>
            </div>
        </div>
    );
}
