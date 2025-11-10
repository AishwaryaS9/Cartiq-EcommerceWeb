'use client'
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon } from "lucide-react"

export default function AdminCoupons() {
    const { getToken } = useAuth()
    const [coupons, setCoupons] = useState([])

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    })

    const fetchCoupons = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/coupon', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setCoupons(data.coupons)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            newCoupon.discount = Number(newCoupon.discount)
            newCoupon.expiresAt = new Date(newCoupon.expiresAt)

            const { data } = await axios.post(
                '/api/admin/coupon',
                { coupon: newCoupon },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success(data.message)
            await fetchCoupons()
            setNewCoupon({
                code: '',
                description: '',
                discount: '',
                forNewUser: false,
                forMember: false,
                isPublic: false,
                expiresAt: new Date()
            })
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const deleteCoupon = async (code) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this coupon?")
            if (!confirmDelete) return
            const token = await getToken()
            await axios.delete(`/api/admin/coupon?code=${code}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            await fetchCoupons()
            toast.success("Coupon deleted successfully")
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    return (
        <main
            className="text-slate-700 mb-32 px-4 md:px-8"
            role="main"
            aria-label="Admin coupon management dashboard"
        >
            {/* Header */}
            <header className="mb-8" role="banner">
                <h1 className="text-2xl font-medium text-primary" aria-label="Add Coupon section">
                    Add <span className="text-slate-700">Coupon</span>
                </h1>
                <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
                    Create, manage, and remove discount coupons.
                </p>
            </header>

            {/* Add Coupon Form */}
            <form
                onSubmit={(e) =>
                    toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })
                }
                className="max-w-xl space-y-4"
                aria-label="Add new coupon form"
            >
                <div className="flex gap-3 max-sm:flex-col">
                    <label className="w-full" htmlFor="coupon-code">
                        <span className="sr-only">Coupon Code</span>
                        <input
                            id="coupon-code"
                            type="text"
                            name="code"
                            placeholder="Coupon Code"
                            value={newCoupon.code}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </label>

                    <label className="w-full" htmlFor="coupon-discount">
                        <span className="sr-only">Discount percentage</span>
                        <input
                            id="coupon-discount"
                            type="number"
                            name="discount"
                            placeholder="Discount (%)"
                            min={1}
                            max={100}
                            value={newCoupon.discount}
                            onChange={handleChange}
                            required
                            aria-required="true"
                            className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </label>
                </div>

                <label htmlFor="coupon-description" className="block">
                    <span className="sr-only">Coupon Description</span>
                    <input
                        id="coupon-description"
                        type="text"
                        name="description"
                        placeholder="Coupon Description"
                        value={newCoupon.description}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    />
                </label>

                <label htmlFor="expiresAt" className="block">
                    <p className="mt-3 text-sm font-medium text-slate-600">
                        Coupon Expiry Date
                    </p>
                    <input
                        id="expiresAt"
                        type="date"
                        name="expiresAt"
                        value={format(newCoupon.expiresAt, "yyyy-MM-dd")}
                        onChange={handleChange}
                        aria-describedby="expiry-help"
                        className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    />
                    <span id="expiry-help" className="sr-only">
                        Choose the date when the coupon will expire
                    </span>
                </label>

                <fieldset
                    className="mt-5 grid sm:grid-cols-2 gap-3"
                    aria-label="Coupon audience selection"
                >
                    <legend className="sr-only">Select coupon target audience</legend>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={newCoupon.forNewUser}
                                onChange={(e) =>
                                    setNewCoupon({
                                        ...newCoupon,
                                        forNewUser: e.target.checked,
                                    })
                                }
                                aria-label="Applicable for new users"
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow"></span>
                        </label>
                        <span className="text-sm text-slate-700">For New Users</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={newCoupon.forMember}
                                onChange={(e) =>
                                    setNewCoupon({
                                        ...newCoupon,
                                        forMember: e.target.checked,
                                    })
                                }
                                aria-label="Applicable for members"
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow"></span>
                        </label>
                        <span className="text-sm text-slate-700">For Members</span>
                    </div>
                </fieldset>

                <button
                    type="submit"
                    className="mt-4 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition active:scale-95 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-1"
                    aria-label="Add new coupon"
                >
                    Add Coupon
                </button>
            </form>

            {/* Coupon List */}

            <section
                className="mt-14"
                aria-label="Existing coupons table"
                role="region"
            >
                <h2 className="text-xl font-medium text-slate-800 mb-4">
                    Existing Coupons
                </h2>

                {/* Table Wrapper */}
                <div className="overflow-x-auto border border-slate-200 rounded-sm bg-white shadow-sm max-w-5xl">
                    <table className="min-w-full text-sm hidden sm:table" role="table">
                        <thead className="bg-slate-50 text-slate-600" role="rowgroup">
                            <tr role="row">
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Code</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Description</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Discount</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Expires At</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">New User</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Member</th>
                                <th scope="col" className="py-3 px-4 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100" role="rowgroup">
                            {coupons.map((coupon) => (
                                <tr
                                    key={coupon.code}
                                    className="hover:bg-slate-50 transition-colors"
                                    role="row"
                                    aria-label={`Coupon ${coupon.code}`}
                                >
                                    <td className="py-3 px-4 font-medium text-slate-800">{coupon.code}</td>
                                    <td className="py-3 px-4 text-slate-700">{coupon.description}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.discount}%</td>
                                    <td className="py-3 px-4 text-slate-700">{format(coupon.expiresAt, "yyyy-MM-dd")}</td>
                                    <td className="py-3 px-4 text-slate-700">{coupon.forNewUser ? "Yes" : "No"}</td>
                                    <td className="py-3 px-4 text-slate-700">{coupon.forMember ? "Yes" : "No"}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() =>
                                                toast.promise(deleteCoupon(coupon.code), {
                                                    loading: "Deleting...",
                                                })
                                            }
                                            className="p-1 rounded-full focus:outline-none"
                                            aria-label={`Delete coupon ${coupon.code}`}
                                        >
                                            <DeleteIcon
                                                className="w-5 h-5 text-red-500 hover:text-red-700 transition"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!coupons.length && (
                                <tr role="row">
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-slate-400"
                                        role="cell"
                                    >
                                        No coupons available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="sm:hidden flex flex-col divide-y divide-slate-200">
                        {coupons.length ? (
                            coupons.map((coupon) => (
                                <div
                                    key={coupon.code}
                                    className="p-4 flex flex-col gap-2 bg-white"
                                    role="group"
                                    aria-label={`Coupon ${coupon.code}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-800">{coupon.code}</span>
                                        <button
                                            onClick={() =>
                                                toast.promise(deleteCoupon(coupon.code), {
                                                    loading: "Deleting...",
                                                })
                                            }
                                            className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                                            aria-label={`Delete coupon ${coupon.code}`}
                                        >
                                            <DeleteIcon
                                                className="w-5 h-5 text-red-500 hover:text-red-700 transition"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    <p className="text-slate-600 text-sm">{coupon.description}</p>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-700 mt-2">
                                        <p><span className="font-medium">Discount:</span> {coupon.discount}%</p>
                                        <p><span className="font-medium">Expires:</span> {format(coupon.expiresAt, "yyyy-MM-dd")}</p>
                                        <p><span className="font-medium">New User:</span> {coupon.forNewUser ? "Yes" : "No"}</p>
                                        <p><span className="font-medium">Member:</span> {coupon.forMember ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-8 text-slate-400">No coupons available</p>
                        )}
                    </div>
                </div>
            </section>

        </main>
    )
}
