'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, StarIcon } from 'lucide-react'
import CategoriesMarquee from './CategoriesMarquee'
import { assets } from '@/assets/assets'

const Hero = () => {
    const router = useRouter();

    return (
        <header
            className="relative w-full overflow-hidden bg-secondary min-h-[85vh] flex flex-col justify-end"
            role="banner"
            aria-label="Main promotional hero section"
        >
            {/* Background Decorative Text */}
            <span
                className="absolute inset-x-0 top-[60%] -translate-y-1/2 text-[120px] sm:text-[200px] md:text-[280px] lg:text-[300px] font-extrabold text-customBlack/5 opacity-80 z-0 select-none pointer-events-none text-center"
                aria-hidden="true"
            >
                SHOP
            </span>

            <div
                className="max-w-7xl mx-auto flex flex-col items-center justify-start px-6 pt-20 pb-0 gap-8 sm:gap-10"
                role="region"
                aria-label="Featured products and categories"
            >
                <div className="w-full flex flex-col md:flex-row justify-between items-start gap-10 z-10">
                    {/* Left Section */}
                    <div className="flex flex-col gap-4 text-left max-w-lg">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light leading-snug text-customBlack">
                            Everything You Love.
                            <br />
                            All in One Place.
                        </h1>

                        <blockquote
                            className="mt-8 relative max-w-xs p-4 border border-customBlack/10 bg-white/50 backdrop-blur-sm shadow-lg text-sm italic font-serif"
                            aria-label="Brand message quote"
                        >
                            &ldquo;Curated quality. Endless possibilities.&rdquo;
                            <span
                                className="absolute left-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50"
                                aria-hidden="true"
                            >
                                &larr;
                            </span>
                            <span
                                className="absolute right-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50"
                                aria-hidden="true"
                            >
                                &rarr;
                            </span>
                        </blockquote>
                    </div>

                    {/* Middle Image */}
                    <div className="w-full relative flex justify-center z-10 mt-[-20px] sm:mt-0">
                        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                            <Image
                                src={assets.hero_model_img1}
                                alt="Model showcasing lifestyle products"
                                className="w-full h-auto drop-shadow-xl rounded-lg"
                                priority
                            />
                            <div
                                className="absolute inset-x-0 bottom-0 h-1/4 bg-customBlack/5 blur-3xl opacity-50 -z-10"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col gap-6 text-left md:text-right items-start md:items-end pt-10">
                        <p className="text-customBlack/80 max-w-sm text-base leading-relaxed">
                            Discover thousands of products across every category — from fashion to home, beauty to tech, and everything in between.
                        </p>

                        <button
                            onClick={() => router.push('/shop')}
                            className="flex items-center gap-2 bg-primary text-white text-base py-3 px-6 rounded-full hover:bg-primary/90 focus:ring-1 focus:ring-primary/40 transition shadow-lg focus:outline-none"
                            aria-label="Navigate to the shop page"
                        >
                            Shop Now
                            <ArrowRightIcon size={16} aria-hidden="true" />
                        </button>

                        {/* Reviews */}
                        <div
                            className="flex items-center gap-2 mt-4"
                            aria-label="Customer rating 4.9 out of 5 based on 2.4K reviews"
                        >
                            <div className="flex text-[#FFC107]" aria-hidden="true">
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

            {/* Categories Marquee */}
            <nav aria-label="Product categories marquee">
                <CategoriesMarquee />
            </nav>
        </header>
    )
}

export default Hero
