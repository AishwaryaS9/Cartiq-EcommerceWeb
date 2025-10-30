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

    const router = useRouter();

    return (
        <section className={`relative w-full overflow-hidden ${backgroundClass}`}>
            <span className="absolute inset-x-0 top-[60%] -translate-y-1/2 text-[150px] sm:text-[300px] font-extrabold text-customBlack/5 opacity-80 z-0 select-none pointer-events-none text-center">
                DIGITAL
            </span>

            <div className="max-w-7xl mx-auto flex flex-col items-center justify-start px-6 pt-20 pb-0 gap-8 sm:gap-10">
                <div className="w-full flex flex-col md:flex-row justify-between items-start gap-10 z-10">
                    <div className="flex flex-col gap-4 text-left max-w-lg">
                        <h1 className="text-4xl sm:text-7xl font-light leading-snug text-customBlack">
                            Modern Devices.
                            <br />
                            Simple Joy.
                        </h1>

                        <div className="mt-8 relative max-w-xs p-4 border border-customBlack/10 bg-white/50 backdrop-blur-sm shadow-lg text-sm italic font-serif">
                            &ldquo;Intelligent, robust, and meticulously designed.&rdquo;
                            <span className="absolute left-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50">
                                &larr;
                            </span>
                            <span className="absolute right-[-20px] top-[50%] -translate-y-1/2 text-lg text-customBlack/50">
                                &rarr;
                            </span>
                        </div>
                    </div>
                    <div className="w-full relative flex justify-center z-10 mt-[-20px] sm:mt-0">

                        <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
                            <Image
                                src={assets.hero_model_img1}
                                alt="Model wearing beige blazer and trousers"
                                className="w-full h-auto drop-shadow-xl"
                                priority
                            />

                            {/* Hotspot 1: Beige Blazer */}
                            {/* <ProductHotspot
                                label="Beige Blazer"
                                price={`99 ${currency}`}
                                position="top-[30%] right-[-50px] sm:right-[-80px]"
                            /> */}

                            {/* Hotspot 2: Beige Trousers */}
                            {/* <ProductHotspot
                                label="Beige Trousers"
                                price={`65 ${currency}`}
                                position="bottom-[10%] left-[-50px] sm:left-[-80px]"
                            /> */}

                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-customBlack/5 blur-3xl opacity-50 -z-10" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 text-left md:text-right items-start md:items-end pt-10">
                        <p className="text-customBlack/80 max-w-sm text-base">
                            Smart devices for the modern minimalist. Crafted to simplify your routines — and upgrade your lifestyle.
                        </p>

                        <button onClick={() => router.push('/shop')}
                            className="flex items-center gap-2 bg-primary text-white text-base py-3 px-6 rounded-full hover:bg-primary/90 transition shadow-lg">
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
                                4.9 / 480 Review
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <CategoriesMarquee />
        </section >
    )
}

export default Hero


// const ProductHotspot = ({ label, price, position }) => (
//     <div className={`absolute ${position} flex items-center gap-2 transform translate-x-1/2 transition-all`}>
//         {/* Pointer dot */}
//         <span className="w-2 h-2 rounded-full bg-customBlack absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
//         <span className="w-3 h-3 rounded-full border border-customBlack bg-white/90" />

//         {/* Product Tag */}
//         <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full pl-4 pr-1 py-1 shadow-lg border border-customBlack/10 text-sm">
//             <span className="text-customBlack font-medium">{label}</span>
//             <span className="text-customBlack/70 ml-2 mr-2 text-xs uppercase">{price}</span>
//             <span className="bg-customBlack text-white rounded-full p-1 ml-1 cursor-pointer hover:bg-customBlack/90 transition">
//                 <ArrowRightIcon size={12} />
//             </span>
//         </div>
//     </div>
// );