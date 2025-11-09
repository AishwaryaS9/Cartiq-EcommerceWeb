'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { assets } from "@/assets/assets"

export default function CreateStore() {
    const { user } = useUser();
    const router = useRouter();
    const { getToken } = useAuth();

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        const token = await getToken();
        try {
            const { data } = await axios.get('/api/store/create', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (['approved', 'rejected', 'pending'].includes(data.status)) {
                setStatus(data.status);
                setAlreadySubmitted(true);
                switch (data.status) {
                    case "approved":
                        setMessage("Your store has been approved. You can now add products to your store from the dashboard.");
                        setTimeout(() => router.push('/store'), 5000)
                        break;
                    case "rejected":
                        setMessage("Your store request has been rejected. Please contact the admin for more details.");
                        break;
                    case "pending":
                        setMessage("Your store request is pending. Please wait for admin approval.");
                        break;
                }
            } else setAlreadySubmitted(false);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (!user) return toast('Please login to continue');
        try {
            const token = await getToken();
            const formData = new FormData()
            Object.entries(storeInfo).forEach(([key, val]) => formData.append(key, val))

            const { data } = await axios.post('/api/store/create', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data.message);
            await fetchSellerStatus();
            setStoreInfo({
                name: "",
                username: "",
                description: "",
                email: "",
                contact: "",
                address: "",
                image: ""
            })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    useEffect(() => {
        if (user) fetchSellerStatus()
    }, [user]);

    if (!user) {
        return (
            <main
                className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400 text-center"
                role="main"
                aria-label="Login required to access store creation form"
            >
                <h1 className="text-2xl sm:text-4xl font-semibold">
                    Please <span className="text-slate-500">Login</span> to continue
                </h1>
            </main>
        )
    }

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <main
                    className="mx-6 min-h-[70vh] my-8"
                    role="main"
                    aria-labelledby="create-store-heading"
                >
                    <form
                        onSubmit={(e) => toast.promise(onSubmitHandler(e), { loading: "Submitting data..." })}
                        className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
                        aria-describedby="create-store-description"
                    >
                        {/* Title */}
                        <header role="banner">
                            <h1 id="create-store-heading" className="text-2xl font-medium text-primary"
                                aria-label="Create Store section">
                                Add Your <span className="text-slate-700">Store</span>
                            </h1>
                            <p id="create-store-description" className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
                                To become a seller on Cartiq, submit your store details for review.
                                Your store will be activated after admin verification.
                            </p>
                        </header>

                        {/* Image Upload */}
                        <label htmlFor="store-logo" className="mt-5 cursor-pointer block">
                            <span className="block text-slate-600 font-medium">Store Logo</span>
                            <Image
                                src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area}
                                className="rounded-lg mt-2 h-16 w-auto object-contain"
                                alt={storeInfo.image ? "Uploaded store logo preview" : "Upload area placeholder"}
                                width={150}
                                height={100}
                            />
                            <input
                                id="store-logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })}
                                hidden
                                aria-label="Upload store logo"
                            />
                        </label>

                        {/* Username */}
                        <label htmlFor="username" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Username</span>
                            <input
                                id="username"
                                name="username"
                                onChange={onChangeHandler}
                                value={storeInfo.username}
                                type="text"
                                placeholder="Enter your store username"
                                required
                                aria-required="true"
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Name */}
                        <label htmlFor="name" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Name</span>
                            <input
                                id="name"
                                name="name"
                                onChange={onChangeHandler}
                                value={storeInfo.name}
                                type="text"
                                placeholder="Enter your store name"
                                required
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Description */}
                        <label htmlFor="description" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Description</span>
                            <textarea
                                id="description"
                                name="description"
                                onChange={onChangeHandler}
                                value={storeInfo.description}
                                rows={5}
                                placeholder="Enter your store description"
                                required
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Email */}
                        <label htmlFor="email" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Email</span>
                            <input
                                id="email"
                                name="email"
                                onChange={onChangeHandler}
                                value={storeInfo.email}
                                type="email"
                                placeholder="Enter your store email"
                                required
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Contact Number */}
                        <label htmlFor="contact" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Contact Number</span>
                            <input
                                id="contact"
                                name="contact"
                                onChange={onChangeHandler}
                                value={storeInfo.contact}
                                type="text"
                                placeholder="Enter your store contact number"
                                required
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Address */}
                        <label htmlFor="address" className="w-full max-w-lg">
                            <span className="block mt-4 text-slate-600 font-medium">Address</span>
                            <textarea
                                id="address"
                                name="address"
                                onChange={onChangeHandler}
                                value={storeInfo.address}
                                rows={5}
                                placeholder="Enter your store address"
                                required
                                className="border border-slate-200 w-full p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                            />
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            aria-label="Submit store details"
                            className="bg-primary font-medium text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1 transition"
                        >
                            Submit
                        </button>
                    </form>
                </main>
            ) : (
                <section
                    className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
                    role="status"
                    aria-live="polite"
                >
                    <p className="sm:text-2xl lg:text-3xl font-semibold text-slate-500 max-w-2xl">
                        {message}
                    </p>
                    {status === "approved" && (
                        <p className="mt-5 text-slate-400">
                            Redirecting to dashboard in{" "}
                            <span className="font-semibold">5 seconds</span>
                        </p>
                    )}
                </section>
            )}
        </>
    ) : (
        <Loading />
    )
}
