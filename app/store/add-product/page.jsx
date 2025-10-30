'use client'
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { SparklesIcon, UploadIcon } from "lucide-react"

export default function StoreAddProduct() {
    const categories = [
        'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health',
        'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink',
        'Hobbies & Crafts', 'Others'
    ]

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
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
            formData.append('category', productInfo.category)
            Object.keys(images).forEach(key => {
                if (images[key]) formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message)

            // Reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: "",
                price: "",
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
        <motion.form
            onSubmit={(e) => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto text-slate-700 mb-32 
                       p-5 sm:p-8 md:p-10 rounded-2xl bg-white/70 
                       backdrop-blur-sm shadow-xs border border-slate-100"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
                <h1 className="text-2xl font-medium tracking-tight text-primary">
                    Add New <span className="text-customBlack">Product</span>
                </h1>

                {aiUsed && (
                    <div className="flex items-center gap-2 text-primary bg-secondary px-3 py-1.5 rounded-full text-sm">
                        <SparklesIcon size={16} /> AI Assist Enabled
                    </div>
                )}
            </div>

            {/* Image Upload Section */}
            <p className="font-medium mb-3 text-sm sm:text-base">Product Images</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`} className="relative group cursor-pointer">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center
                         bg-secondary hover:border-primary transition-all">
                            {images[key] ? (
                                <Image
                                    src={URL.createObjectURL(images[key])}
                                    alt=""
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition">
                                    <UploadIcon size={22} />
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
                        />
                    </label>
                ))}
            </div>

            {/* Product Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {/* Left Column */}
                <div>
                    <label className="flex flex-col gap-2 mb-5">
                        <span className="text-sm font-medium">Product Name</span>
                        <input
                            type="text"
                            name="name"
                            onChange={onChangeHandler}
                            value={productInfo.name}
                            placeholder="e.g., Wireless Headphones"
                            className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                            required
                        />
                    </label>

                    <label className="flex flex-col gap-2 mb-5">
                        <span className="text-sm font-medium">Category</span>
                        <select
                            onChange={onChangeHandler}
                            name="category"
                            value={productInfo.category}
                            className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <label className="flex flex-col gap-2 w-full">
                            <span className="text-sm font-medium">Actual Price ($)</span>
                            <input
                                type="number"
                                name="mrp"
                                onChange={onChangeHandler}
                                value={productInfo.mrp}
                                placeholder="0.00"
                                className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </label>

                        <label className="flex flex-col gap-2 w-full">
                            <span className="text-sm font-medium">Offer Price ($)</span>
                            <input
                                type="number"
                                name="price"
                                onChange={onChangeHandler}
                                value={productInfo.price}
                                placeholder="0.00"
                                className="border border-slate-300 rounded-lg p-2.5 px-4 focus:ring-1 focus:ring-primary outline-none"
                                required
                            />
                        </label>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <label className="flex flex-col gap-2 mb-5">
                        <span className="text-sm font-medium">Description</span>
                        <textarea
                            name="description"
                            onChange={onChangeHandler}
                            value={productInfo.description}
                            placeholder="Write a clear and engaging product description..."
                            rows={8}
                            className="border border-slate-300 rounded-lg p-3 px-4 focus:ring-1 focus:ring-primary outline-none resize-none"
                            required
                        />
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="mt-10 w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-sm transition-all text-center"
            >
                {loading ? "Saving..." : "Add Product"}
            </motion.button>
        </motion.form>
    )
}
