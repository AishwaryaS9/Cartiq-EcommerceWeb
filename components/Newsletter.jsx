'use client'
import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <section
            className="flex flex-col items-center mx-4 my-10 sm:my-8"
            aria-labelledby="newsletter-title"
            role="region"
        >
            {/* Section Header */}
            <header>
                <Title
                    id="newsletter-title"
                    title="Join Newsletter"
                    description="Subscribe to get exclusive deals, new arrivals, and insider updates delivered straight to your inbox every week."
                    visibleButton={false}
                />
            </header>

            {/* Newsletter Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                }}
                className="flex flex-col sm:flex-row items-stretch bg-slate-50 text-sm p-2 sm:p-1 w-full max-w-xl my-10 border-2 border-white ring ring-slate-200 focus-within:ring-primary/50 transition-all rounded-2xl sm:rounded-full"
                aria-label="Newsletter subscription form"
            >
                {/* Hidden Label for Accessibility */}
                <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                </label>

                {/* Input Field */}
                <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    aria-label="Enter your email address"
                    placeholder="Enter your email address"
                    className="flex-1 w-full px-4 py-3 text-slate-800 placeholder-slate-500 rounded-xl sm:rounded-full focus:ring-2 focus:ring-primary/40 outline-none text-sm bg-transparent"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-3 sm:mt-0 sm:ml-2 font-medium bg-primary text-white px-6 py-3 rounded-xl sm:rounded-full hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform duration-200"
                    aria-label="Subscribe to newsletter"
                >
                    Get Updates
                </button>
            </form>
        </section>
    )
}

export default Newsletter
