'use client';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { XIcon, CheckCircle2 } from 'lucide-react';

export default function PaymentSuccess() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(true);
    const order = useSelector((state) => state.order.currentOrder);

    const downloadInvoice = () => {
        if (!order) {
            toast.error('No order data found.');
            return;
        }

        // Helper to prevent jsPDF.text errors
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
        doc.text('Cartiq Retail Pvt. Ltd.', margin, y + 15);
        doc.text('123 Innovation Park, Bengaluru, Karnataka, 560001', margin, y + 28);
        doc.text('PAN No: AACCR1234X', margin, y + 41);
        doc.text('GST Registration No: 29AACCR1234X1Z7', margin, y + 54);

        // Invoice Info
        const orderDate = order.timestamp
            ? new Date(order.timestamp).toLocaleDateString()
            : new Date().toLocaleDateString();

        const orderId = order.orderId || order.id || order._id || '00000000';
        // const invoiceNo = 'INV-' + orderId.toString().slice(0, 8).toUpperCase();

        y += 80;
        doc.setFont('helvetica', 'bold');
        // doc.text('Order Number:', margin, y);
        // doc.text('Invoice Number:', margin + 220, y);
        doc.text('Order Date:', margin + 400, y);
        y += 15;
        doc.setFont('helvetica', 'normal');
        // doc.text(safeText(orderId), margin, y);
        // doc.text(safeText(invoiceNo), margin + 220, y);
        doc.text(safeText(orderDate), margin + 400, y);
        line(y + 10);

        // Billing & Shipping
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
        const shipping = [
            safeText(addr.name),
            `${addr.street || ''}`,
            `${addr.city || ''}, ${addr.state || ''}, ${addr.zip || ''}`,
            `${addr.country || 'India'}`,
            `Phone: ${addr.phone || 'N/A'}`,
        ];
        billing.forEach((lineText, i) => doc.text(lineText, margin, y + 14 * i));
        shipping.forEach((lineText, i) => doc.text(lineText, margin + 250, y + 14 * i));

        y += 90;
        line(y);

        // Items Table
        const items = Array.isArray(order.items) ? order.items : [];
        const tableData = items.map((item, idx) => [
            idx + 1,
            safeText(item.name),
            // safeText(item.orderId || order.orderIds?.[0] || 'N/A'), 
            `$${Number(item.price || 0).toFixed(2)}`,
            '0.00',
            safeText(item.quantity),
            `$${(item.price * item.quantity).toFixed(2)}`,
            '18%',
            'IGST',
            `$${((item.price * item.quantity) * 0.18).toFixed(2)}`,
            `$${((item.price * item.quantity) * 1.18).toFixed(2)}`,
        ]);

        autoTable(doc, {
            startY: y + 20,
            head: [
                [
                    'Sl. No',
                    'Description',
                    'Unit Price',
                    'Discount',
                    'Qty',
                    'Net Amount',
                    'Tax Rate',
                    'Tax Type',
                    'Tax Amt',
                    'Total Amt',
                ],
            ],
            body: tableData,
            styles: { fontSize: 8, cellPadding: 4, lineColor: 230, lineWidth: 0.2 },
            headStyles: { fillColor: [245, 245, 245], textColor: 20, fontStyle: 'bold' },
            columnStyles: {
                0: { halign: 'center', cellWidth: 35 },
                1: { cellWidth: 140 },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'center' },
                5: { halign: 'right' },
                6: { halign: 'center' },
                7: { halign: 'center' },
                8: { halign: 'right' },
                9: { halign: 'right' },
            },
        });

        let finalY = doc.lastAutoTable.finalY + 20;
        line(finalY);

        // Totals
        const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);
        const discount = order.coupon ? (subtotal * (order.coupon.discount || 0)) / 100 : 0;
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
                order.timestamp ? new Date(order.timestamp).toLocaleString() : new Date().toLocaleString()
            )}`,
            margin,
            infoY + 30
        );
        doc.text(`Whether tax is payable under reverse charge - No`, margin, infoY + 45);

        // Authorized Signatory
        doc.text('For Cartiq Retail Pvt. Ltd.:', margin, infoY + 90);
        doc.text('Authorized Signatory', margin, infoY + 110);

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
            <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Icon */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                >
                    <XIcon size={22} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <CheckCircle2 className="mx-auto text-green-500" size={40} />
                    <h2 className="text-2xl font-semibold text-green-600 mt-2">
                        Payment Successful!
                    </h2>
                    <p className="text-gray-500">Your order has been placed successfully.</p>
                </div>

                {/* Buttons */}
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
