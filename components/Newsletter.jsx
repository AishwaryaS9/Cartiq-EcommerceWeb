'use client'
import React, { useState } from 'react'
import toast from "react-hot-toast"
import Title from './Title'

const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address.")
            return
        }

        setStatus("loading")

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || "Failed to subscribe.")
                setStatus("error")
                setEmail('')
                return
            }

            toast.success("You're subscribed! Check your inbox.");
            setStatus("success")
            setEmail('')

        } catch {
            toast.error("Something went wrong. Try again.");
            setStatus("error")
            setEmail('')
        } finally {
            setTimeout(() => setStatus(null), 1500)
        }
    }

    return (
        <section
            className="flex flex-col items-center mx-4 my-10 sm:my-8"
            aria-labelledby="newsletter-title"
            role="region"
        >
            <header>
                <Title
                    id="newsletter-title"
                    title="Join Newsletter"
                    description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
                    visibleButton={false}
                />
            </header>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch bg-slate-50 text-sm p-2 sm:p-1 w-full max-w-xl my-10 border-2 border-white ring ring-slate-200 focus-within:ring-primary/50 transition-all rounded-2xl sm:rounded-full"
            >
                <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                </label>

                <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 w-full px-4 py-3 text-slate-800 placeholder-slate-500 rounded-xl sm:rounded-full outline-none text-sm bg-transparent"
                />

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-3 sm:mt-0 sm:ml-2 font-medium bg-primary text-white px-6 py-3 rounded-xl sm:rounded-full hover:scale-105 active:scale-95 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 transition-transform duration-200 disabled:opacity-50"
                >
                    {status === "loading" ? "Submitting..." : "Get Updates"}
                </button>
            </form>
        </section>
    )
}

export default Newsletter
