import React from 'react'

const SkeletonLoading = ({ displayQuantity }) => {

    return (
        <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-8 xl:gap-12 animate-pulse'>
            {Array(displayQuantity).fill(null).map((_, index) => (
                <div key={index} className='bg-secondary h-40 sm:w-60 sm:h-68 rounded-lg' />
            ))}
        </div>
    )
}

export default SkeletonLoading