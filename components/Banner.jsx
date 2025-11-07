'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true);

    const handleClaim = () => {
        setIsOpen(false);
        toast.success('Coupon copied to clipboard!');
        navigator.clipboard.writeText('NEW20');
    };

    if (!isOpen) return null;

    return (
        <section
            className="w-full px-6 py-1 font-medium text-sm text-white text-center bg-gradient-to-r from-primary to-[#aee4af] shadow-md"
            role="region"
            aria-label="Promotional banner offering discount"
        >
            <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto gap-3">
                <p className="text-white text-xs sm:text-base" role="text">
                    🎉 Get <strong>20% OFF</strong> on Your First Order!
                </p>

                <div className="flex items-center space-x-3 sm:space-x-6">
                    <button
                        onClick={handleClaim}
                        type="button"
                        className="font-normal text-gray-800 bg-white hover:bg-gray-100 px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                        aria-label="Claim 20 percent off offer and copy coupon code NEW20"
                    >
                        Claim Offer
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition"
                        aria-label="Close promotional banner"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <rect
                                y="12.532"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-45.74 0 12.532)"
                                fill="#fff"
                            />
                            <rect
                                x="12.533"
                                y="13.915"
                                width="17.498"
                                height="2.1"
                                rx="1.05"
                                transform="rotate(-135.74 12.533 13.915)"
                                fill="#fff"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
