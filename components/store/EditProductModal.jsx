"use client"
import Image from "next/image"
import { motion } from "framer-motion"

export default function EditProductModal({
    isOpen,
    product,
    onClose,
    onChange,
    onSubmit,
}) {
    if (!isOpen || !product) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-product-title"
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 sm:p-6 overflow-y-auto"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex justify-between items-center rounded-t-2xl">
                    <h2 id="edit-product-title" className="text-xl font-medium text-primary">
                        Edit <span className="text-slate-700">Product</span>
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close edit product modal"
                        className="text-slate-500 hover:text-primary transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-5">
                    <form id="edit-product-form" onSubmit={onSubmit} className="flex flex-col gap-5">
                        {/* Product Name */}
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-600 mb-1">
                                Product Name
                            </label>
                            <input
                                id="edit-name"
                                type="text"
                                value={product.name}
                                onChange={(e) => onChange({ ...product, name: e.target.value })}
                                placeholder="Enter product name"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-600 mb-1">
                                Description
                            </label>
                            <textarea
                                id="edit-description"
                                value={product.description}
                                onChange={(e) =>
                                    onChange({ ...product, description: e.target.value })
                                }
                                rows={3}
                                placeholder="Enter product description"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="edit-mrp" className="block text-sm font-medium text-slate-600 mb-1">
                                    Actual Price
                                </label>
                                <input
                                    id="edit-mrp"
                                    type="number"
                                    value={product.mrp}
                                    onChange={(e) =>
                                        onChange({ ...product, mrp: Number(e.target.value) })
                                    }
                                    placeholder="Enter MRP"
                                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-price" className="block text-sm font-medium text-slate-600 mb-1">
                                    Offer Price
                                </label>
                                <input
                                    id="edit-price"
                                    type="number"
                                    value={product.price}
                                    onChange={(e) =>
                                        onChange({ ...product, price: Number(e.target.value) })
                                    }
                                    placeholder="Enter selling price"
                                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label htmlFor="edit-quantity" className="block text-sm font-medium text-slate-600 mb-1">
                                Stock Quantity
                            </label>
                            <input
                                id="edit-quantity"
                                type="number"
                                value={product.stockQuantity}
                                onChange={(e) =>
                                    onChange({ ...product, stockQuantity: Number(e.target.value) })
                                }
                                placeholder="Enter stock quantity"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                required
                            />
                        </div>

                        {/* Product Images */}
                        <section aria-labelledby="image-edit-section">
                            <h3 id="image-edit-section" className="text-sm font-semibold text-slate-700 mb-2">
                                Product Images
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[...(product.existingImages || []), ...(product.newImages || [])].map(
                                    (img, idx) => (
                                        <div
                                            key={`image-${idx}`}
                                            className="relative group rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                                        >
                                            <Image
                                                src={
                                                    typeof img === "string"
                                                        ? img
                                                        : URL.createObjectURL(img)
                                                }
                                                alt={`Product image ${idx + 1}`}
                                                width={300}
                                                height={300}
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                aria-label={`Remove image ${idx + 1}`}
                                                onClick={() => {
                                                    if (typeof img === "string") {
                                                        onChange({
                                                            ...product,
                                                            existingImages: product.existingImages.filter(
                                                                (i) => i !== img
                                                            ),
                                                            removedImages: [
                                                                ...product.removedImages,
                                                                img,
                                                            ],
                                                        })
                                                    } else {
                                                        onChange({
                                                            ...product,
                                                            newImages: product.newImages.filter(
                                                                (i) => i !== img
                                                            ),
                                                        })
                                                    }
                                                }}
                                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-full p-1 shadow-sm transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                )}

                                {Array.from({
                                    length: Math.max(
                                        0,
                                        4 -
                                        ((product.existingImages?.length || 0) +
                                            (product.newImages?.length || 0))
                                    ),
                                }).map((_, idx) => (
                                    <label
                                        key={`upload-slot-${idx}`}
                                        htmlFor={`new-image-${idx}`}
                                        className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:border-primary hover:bg-slate-100 cursor-pointer transition"
                                    >
                                        <span className="text-xs text-slate-400">Upload</span>
                                        <input
                                            id={`new-image-${idx}`}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) =>
                                                onChange({
                                                    ...product,
                                                    newImages: [
                                                        ...product.newImages,
                                                        ...Array.from(e.target.files),
                                                    ],
                                                })
                                            }
                                        />
                                    </label>
                                ))}
                            </div>
                        </section>
                    </form>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 flex flex-col sm:flex-row justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border font-medium border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-product-form"
                        className="px-5 py-2 bg-primary font-medium text-white rounded-lg hover:bg-primary/90 transition w-full sm:w-auto"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
