'use client'
import { useState } from "react"
import Image from "next/image"
import Head from "next/head"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { SparklesIcon, UploadIcon } from "lucide-react"
import { categories } from "@/assets/assets"

export default function StoreAddProduct() {
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        stockQuantity: "",
        category: "",
    })
    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)
    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleImageUpload = async (key, file) => {
        setImages(prev => ({ ...prev, [key]: file }))
        if (key === "1" && file && !aiUsed) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64String = reader.result.split(",")[1]
                const mimeType = file.type
                const token = await getToken()
                try {
                    await toast.promise(
                        axios.post('/api/store/ai', { base64Image: base64String, mimeType }, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        {
                            loading: "Analyzing image with AI...",
                            success: (res) => {
                                const data = res.data
                                if (data.name && data.description) {
                                    setProductInfo(prev => ({
                                        ...prev,
                                        name: data.name,
                                        description: data.description
                                    }))
                                    setAiUsed(true)
                                    return "AI filled product info 🎉"
                                }
                                return "AI could not analyze the image"
                            },
                            error: (err) => err?.response?.data?.error || err.message
                        }
                    )
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!images[1] && !images[2] && !images[3] && !images[4]) {
                return toast.error('Please upload at least one image')
            }

            setLoading(true)
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('stockQuantity', productInfo.stockQuantity)
            formData.append('category', productInfo.category)
            Object.keys(images).forEach(key => {
                if (images[key]) formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message)

            setProductInfo({
                name: "",
                description: "",
                mrp: "",
                price: "",
                stockQuantity: "",
                category: "",
            })
            setImages({ 1: null, 2: null, 3: null, 4: null })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>Add Product | Your Store Dashboard</title>
                <meta
                    name="description"
                    content="Add new products to your store with AI-assisted descriptions and image uploads. Fully accessible, SEO-friendly form."
                />
            </Head>

            <motion.form
                onSubmit={(e) => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto text-slate-700 mb-32 p-5 sm:p-8 md:p-10 
                           rounded-2xl bg-white/70 backdrop-blur-sm shadow-xs border border-slate-100 
                           overflow-hidden min-h-[calc(100vh-200px)]"
                aria-labelledby="form-heading"
                role="form"
            >
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
                    <h1 id="form-heading" className="text-2xl font-medium tracking-tight text-primary">
                        Add New <span className="text-slate-700">Product</span>
                    </h1>
                    {aiUsed && (
                        <div
                            className="flex items-center gap-2 text-primary bg-secondary px-3 py-1.5 rounded-full text-sm"
                            aria-live="polite"
                        >
                            <SparklesIcon size={16} aria-hidden="true" />
                            <span>AI Assist Enabled</span>
                        </div>
                    )}
                </header>

                {/* Image Upload Section */}
                <section aria-labelledby="image-upload-section" className="mb-10">
                    <h2 id="image-upload-section" className="font-medium mb-3 text-sm sm:text-base">
                        Product Images
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.keys(images).map((key) => (
                            <label
                                key={key}
                                htmlFor={`images${key}`}
                                className="relative group cursor-pointer"
                                aria-label={`Upload image ${key}`}
                            >
                                <div
                                    className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 
                                               flex items-center justify-center bg-secondary hover:border-primary transition-all"
                                    role="img"
                                    aria-label={images[key] ? `Preview of uploaded image ${key}` : `Empty image slot ${key}`}
                                >
                                    {images[key] ? (
                                        <Image
                                            src={URL.createObjectURL(images[key])}
                                            alt={`Uploaded product image ${key}`}
                                            width={300}
                                            height={300}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition">
                                            <UploadIcon size={22} aria-hidden="true" />
                                            <p className="text-xs mt-1">Upload</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id={`images${key}`}
                                    hidden
                                    onChange={e => handleImageUpload(key, e.target.files[0])}
                                    aria-describedby="image-upload-section"
                                />
                            </label>
                        ))}
                    </div>
                </section>

                {/* Product Info Section */}

                <section
                    aria-labelledby="product-info-section"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start"
                >
                    {/* Left column */}
                    <div className="space-y-5">
                        {/* Product Name */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium" id="product-name-label">
                                Product Name
                            </span>
                            <input
                                type="text"
                                name="name"
                                aria-labelledby="product-name-label"
                                onChange={onChangeHandler}
                                value={productInfo.name}
                                placeholder="e.g., Wireless Headphones"
                                className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </label>

                        {/* Category */}
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium" id="category-label">
                                Category
                            </span>
                            <select
                                onChange={onChangeHandler}
                                name="category"
                                value={productInfo.category}
                                aria-labelledby="category-label"
                                className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium" id="stock-label">
                                Stock Quantity
                            </span>
                            <input
                                type="number"
                                name="stockQuantity"
                                aria-labelledby="stock-label"
                                onChange={onChangeHandler}
                                value={productInfo.stockQuantity}
                                placeholder="Enter available stock quantity"
                                className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                required
                                min="0"
                            />
                        </label>

                        {/* Prices — same row on md+, stacked on small screens */}
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                            <label className="flex flex-col gap-2 w-full sm:w-1/2">
                                <span className="text-sm font-medium" id="mrp-label">
                                    Actual Price ($)
                                </span>
                                <input
                                    type="number"
                                    name="mrp"
                                    aria-labelledby="mrp-label"
                                    onChange={onChangeHandler}
                                    value={productInfo.mrp}
                                    placeholder="0.00"
                                    className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2 w-full sm:w-1/2">
                                <span className="text-sm font-medium" id="price-label">
                                    Offer Price ($)
                                </span>
                                <input
                                    type="number"
                                    name="price"
                                    aria-labelledby="price-label"
                                    onChange={onChangeHandler}
                                    value={productInfo.price}
                                    placeholder="0.00"
                                    className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                    required
                                />
                            </label>

                        </div>
                    </div>

                    {/* Right column — Description */}
                    <div className="self-start">
                        <label className="flex flex-col gap-2 mb-5">
                            <span className="text-sm font-medium" id="description-label">
                                Description
                            </span>
                            <textarea
                                name="description"
                                aria-labelledby="description-label"
                                onChange={onChangeHandler}
                                value={productInfo.description}
                                placeholder="Write a clear and engaging product description..."
                                rows={8}
                                className="border border-slate-300 rounded-lg p-3 px-4 focus:ring-1 focus:ring-primary outline-none resize-none"
                                required
                            />
                        </label>
                    </div>
                </section>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="mt-10 w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white 
                               font-medium rounded-xl shadow-sm transition-all text-center"
                    aria-label="Submit new product form"
                    aria-busy={loading}
                >
                    {loading ? "Saving..." : "Add Product"}
                </motion.button>
            </motion.form>
        </>
    )
}
