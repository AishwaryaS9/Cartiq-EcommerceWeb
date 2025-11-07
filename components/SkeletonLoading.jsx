'use client'
import React from 'react'

const SkeletonLoading = ({ displayQuantity }) => {
    return (
        <div
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12 animate-pulse"
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
