'use client'
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { XIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { addAddress } from "@/lib/features/address/addressSlice"

const AddressModal = ({ setShowAddressModal }) => {

    const { getToken } = useAuth()
    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/address', { address }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(addAddress(data.newAddress))
            toast.success(data.message)
            setShowAddressModal(false)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    return (
        <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
            aria-describedby="address-modal-desc"
            onSubmit={(e) =>
                toast.promise(handleSubmit(e), { loading: 'Adding Address...' })
            }
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur h-screen flex items-center justify-center"
        >
            <div className="flex flex-col gap-5  w-full max-w-sm mx-6">
                <h2
                    id="address-modal-title"
                    className="text-3xl font-medium text-primary"
                >
                    Add New <span className="font-medium text-slate-700">Address</span>
                </h2>
                <p id="address-modal-desc" className="sr-only">
                    Enter your address information and save it to your account.
                </p>

                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                    id="name"
                    name="name"
                    aria-label="Full name"
                    onChange={handleAddressChange}
                    value={address.name}
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                    type="text"
                    placeholder="Enter your name"
                    required
                />

                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                    id="email"
                    name="email"
                    aria-label="Email address"
                    onChange={handleAddressChange}
                    value={address.email}
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                    type="email"
                    placeholder="Email address"
                    required
                />

                <label htmlFor="street" className="sr-only">Street Address</label>
                <input
                    id="street"
                    name="street"
                    aria-label="Street address"
                    onChange={handleAddressChange}
                    value={address.street}
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                    type="text"
                    placeholder="Street"
                    required
                />

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="city" className="sr-only">City</label>
                        <input
                            id="city"
                            name="city"
                            aria-label="City"
                            onChange={handleAddressChange}
                            value={address.city}
                            className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                            type="text"
                            placeholder="City"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="state" className="sr-only">State</label>
                        <input
                            id="state"
                            name="state"
                            aria-label="State"
                            onChange={handleAddressChange}
                            value={address.state}
                            className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                            type="text"
                            placeholder="State"
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="zip" className="sr-only">Zip Code</label>
                        <input
                            id="zip"
                            name="zip"
                            aria-label="Zip code"
                            onChange={handleAddressChange}
                            value={address.zip}
                            className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                            type="number"
                            placeholder="Zip code"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="country" className="sr-only">Country</label>
                        <input
                            id="country"
                            name="country"
                            aria-label="Country"
                            onChange={handleAddressChange}
                            value={address.country}
                            className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                            type="text"
                            placeholder="Country"
                            required
                        />
                    </div>
                </div>

                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <input
                    id="phone"
                    name="phone"
                    aria-label="Phone number"
                    onChange={handleAddressChange}
                    value={address.phone}
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full focus:ring-1 focus:ring-primary"
                    type="tel"
                    placeholder="Phone"
                    required
                />

                <button
                    type="submit"
                    className="bg-primary text-white text-sm font-medium py-2.5 rounded-md hover:bg-primary/90 active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    SAVE ADDRESS
                </button>
            </div>

            <button
                type="button"
                aria-label="Close address modal"
                onClick={() => setShowAddressModal(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer focus:outline-none  focus:ring-1 focus:ring-primary rounded-full p-1"
            >
                <XIcon size={30} />
            </button>
        </form>
    )
}

export default AddressModal
