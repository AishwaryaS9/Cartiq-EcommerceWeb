'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon, Trash2 } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

export default function AdminCoupons() {
    const { getToken } = useAuth();
    const [coupons, setCoupons] = useState([]);

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: new Date()
    });

    const fetchCoupons = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/admin/coupon', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCoupons(data.coupons);
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            newCoupon.discount = Number(newCoupon.discount);
            newCoupon.expiresAt = new Date(newCoupon.expiresAt);

            const { data } = await axios.post(
                '/api/admin/coupon',
                { coupon: newCoupon },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(data.message);
            await fetchCoupons();
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
    };

    const deleteCoupon = async (code) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
            if (!confirmDelete) return;
            const token = await getToken();
            await axios.delete(`/api/admin/coupon?code=${code}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchCoupons();
            toast.success("Coupon deleted successfully");
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className="text-slate-700 mb-32 px-4 md:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-medium text-primary">
                    Add <span className="text-customBlack">Coupon</span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Create, manage, and remove discount coupons
                </p>
            </div>

            {/* Add Coupon Card */}
            <form
                onSubmit={(e) =>
                    toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })
                }
                className="max-w-xl space-y-4"
            >

                <div className="flex gap-3 max-sm:flex-col">
                    <input
                        type="text"
                        name="code"
                        placeholder="Coupon Code"
                        value={newCoupon.code}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                    <input
                        type="number"
                        name="discount"
                        placeholder="Discount (%)"
                        min={1}
                        max={100}
                        value={newCoupon.discount}
                        onChange={handleChange}
                        required
                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                </div>

                <input
                    type="text"
                    name="description"
                    placeholder="Coupon Description"
                    value={newCoupon.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                />

                <label className="block">
                    <p className="mt-3 text-sm font-medium text-slate-600">
                        Coupon Expiry Date
                    </p>
                    <input
                        type="date"
                        name="expiresAt"
                        value={format(newCoupon.expiresAt, "yyyy-MM-dd")}
                        onChange={handleChange}
                        className="w-full mt-1 p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 outline-none"
                    />
                </label>

                <div className="mt-5 grid sm:grid-cols-2 gap-3">
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
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out peer-checked:translate-x-5 shadow"></span>
                        </label>
                        <span className="text-sm text-slate-700">For Members</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-4 px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition active:scale-95"
                >
                    Add Coupon
                </button>
            </form>

            {/* Coupon List */}
            <div className="mt-14">
                <h2 className="text-xl font-medium text-slate-800 mb-4">
                    Existing Coupons
                </h2>
                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm max-w-5xl">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">Code</th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Description
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">Discount</th>
                                <th className="py-3 px-4 text-left font-semibold">
                                    Expires At
                                </th>
                                <th className="py-3 px-4 text-left font-semibold">New User</th>
                                <th className="py-3 px-4 text-left font-semibold">Member</th>
                                <th className="py-3 px-4 text-left font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon) => (
                                <tr
                                    key={coupon.code}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="py-3 px-4 font-medium text-slate-800">
                                        {coupon.code}
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {coupon.description}
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">
                                        {coupon.discount}%
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {format(coupon.expiresAt, "yyyy-MM-dd")}
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {coupon.forNewUser ? "Yes" : "No"}
                                    </td>
                                    <td className="py-3 px-4 text-slate-700">
                                        {coupon.forMember ? "Yes" : "No"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <DeleteIcon
                                            onClick={() =>
                                                toast.promise(deleteCoupon(coupon.code), {
                                                    loading: "Deleting...",
                                                })
                                            }
                                            className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {!coupons.length && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-slate-400"
                                    >
                                        No coupons available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
