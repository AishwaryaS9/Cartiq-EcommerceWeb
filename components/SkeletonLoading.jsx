'use client'
import React from 'react'

const SkeletonLoading = ({ displayQuantity }) => {
    return (
        <div
            className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-12 justify-items-center animate-pulse"
            role="status"
            aria-live="polite"
            aria-label="Loading products">
            <span className="sr-only">Loading content, please wait...</span>
            {Array.from({ length: displayQuantity }, (_, index) => (
                <div
                    key={index}
                    className="bg-secondary/70 h-40 sm:w-60 sm:h-68 rounded-lg shadow-sm relative overflow-hidden"
                    aria-hidden="true">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
            ))}
        </div>
    )
}

export default SkeletonLoading
