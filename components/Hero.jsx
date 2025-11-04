'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import { ArrowRightIcon, StarIcon } from 'lucide-react'
import CategoriesMarquee from './CategoriesMarquee'
import { useRouter } from 'next/navigation'

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'USD'
    const backgroundClass = "bg-secondary min-h-[85vh] flex flex-col justify-end"
    const router = useRouter()

    return (
        <section className={`relative w-full overflow-hidden ${backgroundClass}`}>
            {/* Background Text */}
            <span className="absolute inset-x-0 top-[60%] -translate-y-1/2 text-[150px] sm:text-[300px] font-extrabold text-customBlack/5 opacity-80 z-0 select-none pointer-events-none text-center">
                SHOP
            </span>

            <div className="max-w-7xl mx-auto flex flex-col items-center justify-start px-6 pt-20 pb-0 gap-8 sm:gap-10">
                <div className="w-full flex flex-col md:flex-row justify-between items-start gap-10 z-10">

                    {/* Left Section */}
                    <div className="flex flex-col gap-4 text-left max-w-lg">
                        <h1 className="text-4xl sm:text-7xl font-light leading-snug text-customBlack">
                            Everything You Love.<br />
                            All in One Place.
                        </h1>

                        <div className="mt-8 relative max-w-xs p-4 border border-customBlack/10 bg-white/50 backdrop-blur-sm shadow-lg text-sm italic font-serif">
                            &ldquo;Curated quality. Endless possibilities.&rdquo;
                            <span className="absolute left-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50">
                                &larr;
                            </span>
                            <span className="absolute right-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50">
                                &rarr;
                            </span>
                        </div>
                    </div>

                    {/* Middle Image */}
                    <div className="w-full relative flex justify-center z-10 mt-[-20px] sm:mt-0">
                        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
                            <Image
                                src={assets.hero_model_img1}
                                alt="Lifestyle collection preview"
                                className="w-full h-auto drop-shadow-xl"
                                priority
                            />
                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-customBlack/5 blur-3xl opacity-50 -z-10" />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col gap-6 text-left md:text-right items-start md:items-end pt-10">
                        <p className="text-customBlack/80 max-w-sm text-base">
                            Discover thousands of products across every category — from fashion to home, beauty to tech, and everything in between.
                        </p>

                        <button
                            onClick={() => router.push('/shop')}
                            className="flex items-center gap-2 bg-primary text-white text-base py-3 px-6 rounded-full hover:bg-primary/90 transition shadow-lg"
                        >
                            Shop Now
                            <ArrowRightIcon size={16} />
                        </button>

                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex text-[#FFC107]">
                                <StarIcon fill="currentColor" size={16} />
                                <StarIcon fill="currentColor" size={16} />
                                <StarIcon fill="currentColor" size={16} />
                                <StarIcon fill="currentColor" size={16} />
                                <StarIcon fill="currentColor" size={16} />
                            </div>
                            <span className="text-customBlack/70 text-sm">
                                4.9 / 2.4K Reviews
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <CategoriesMarquee />
        </section>
    )
}

export default Hero
