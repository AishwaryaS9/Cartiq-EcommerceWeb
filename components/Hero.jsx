// 'use client'
// import { assets } from '@/assets/assets'
// import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'
// import CategoriesMarquee from './CategoriesMarquee'

// const Hero = () => {

//     const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

//     return (
//         <div className='mx-6'>
//             <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
//                 <div className='relative flex-1 flex flex-col bg-green-200 rounded-3xl xl:min-h-100 group'>
//                     <div className='p-5 sm:p-16'>
//                         <div className='inline-flex items-center gap-3 bg-green-300 text-green-600 pr-4 p-1 rounded-full text-xs sm:text-sm'>
//                             <span className='bg-green-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
//                         </div>
//                         <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-[#A0FF74] bg-clip-text text-transparent max-w-xs  sm:max-w-md'>
//                             Gadgets you'll love. Prices you'll trust.
//                         </h2>
//                         <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
//                             <p>Starts from</p>
//                             <p className='text-3xl'>{currency}4.90</p>
//                         </div>
//                         <button className='bg-slate-800 text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:bg-slate-900 hover:scale-103 active:scale-95 transition'>LEARN MORE</button>
//                     </div>
//                     <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm' src={assets.hero_model_img} alt="" />
//                 </div>
//                 <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
//                     <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group'>
//                         <div>
//                             <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>Best products</p>
//                             <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
//                         </div>
//                         <Image className='w-35' src={assets.hero_product_img1} alt="" />
//                     </div>
//                     <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group'>
//                         <div>
//                             <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>20% discounts</p>
//                             <p className='flex items-center gap-1 mt-4'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
//                         </div>
//                         <Image className='w-35' src={assets.hero_product_img2} alt="" />
//                     </div>
//                 </div>
//             </div>
//             <CategoriesMarquee />
//         </div>

//     )
// }

// export default Hero



// 'use client'
// import { assets } from '@/assets/assets'
// import Image from 'next/image'
// import React from 'react'
// import CategoriesMarquee from './CategoriesMarquee'
// import { ArrowRightIcon } from 'lucide-react'

// const Hero = () => {
//     const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

//     return (
//         <section className="relative w-full overflow-hidden">
//             {/* Background gradient */}
//             <div className="absolute inset-0 bg-gradient-to-r from-[#A0FF74] via-green-300 to-blue-200 blur-3xl opacity-30 -z-10" />

//             <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 md:py-28 gap-10">
//                 {/* Left text section */}
//                 <div className="flex-1 text-center md:text-left">
//                     <h1 className="text-4xl sm:text-6xl font-semibold leading-tight bg-gradient-to-r from-slate-700 to-green-600 bg-clip-text text-transparent">
//                         Discover gadgets that spark joy.
//                     </h1>

//                     <p className="text-slate-600 mt-5 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
//                         Premium tech accessories, starting from just{' '}
//                         <span className="font-semibold">{currency}4.90</span>. Designed to make your
//                         everyday smarter, simpler, and more fun.
//                     </p>

//                     <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
//                         <button className="bg-primary text-white text-sm sm:text-base py-3 px-8 rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition">
//                             Shop Now
//                         </button>
//                         <button className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition text-sm sm:text-base">
//                             Learn More <ArrowRightIcon size={18} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Right image section */}
//                 <div className="flex-1 relative flex justify-center">
//                     <div className="relative">
//                         <Image
//                             src={assets.hero_model_img}
//                             alt="Featured product"
//                             className="w-[90%] sm:w-[400px] drop-shadow-2xl"
//                             priority
//                         />
//                         {/* Subtle glow behind image */}
//                         <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-blue-200 rounded-full blur-3xl opacity-50 -z-10" />
//                     </div>
//                 </div>
//             </div>

//             {/* Categories section below hero */}
//             <CategoriesMarquee />
//         </section>
//     )
// }

// export default Hero


'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { ArrowRightIcon } from 'lucide-react'

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <section className="relative w-full overflow-hidden bg-secondary">
            {/* Soft gradient background using theme colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-secondary to-primary/90 blur-3xl opacity-60 -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 md:py-28 gap-10">
                {/* Left text section */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl sm:text-6xl font-semibold leading-tight bg-gradient-to-r from-customBlack to-primary bg-clip-text text-transparent">
                        Discover gadgets that spark joy.
                    </h1>

                    <p className="text-[--color-customBlack]/70 mt-5 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
                        Premium tech accessories, starting from just{' '}
                        <span className="font-semibold">{currency}4.90</span>. Designed to make your
                        everyday smarter, simpler, and more fun.
                    </p>

                    <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                        <button className="bg-primary text-white text-sm sm:text-base py-3 px-8 rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition">
                            Shop Now
                        </button>
                        <button className="flex items-center gap-2 text-customBlack/80 hover:text-customBlack transition text-sm sm:text-base">
                            Learn More <ArrowRightIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Right image section */}
                <div className="flex-1 relative flex justify-center">
                    <div className="relative">
                        <Image
                            src={assets.hero_model_img1}
                            alt="Featured product"
                            className="w-[90%] sm:w-[400px] drop-shadow-2xl"
                            priority
                        />
                        {/* Subtle glow using primary tone */}
                        <div className="absolute inset-0 bg-primary/40 rounded-full blur-3xl opacity-50 -z-10" />
                    </div>
                </div>
            </div>

            {/* Categories section below hero */}
            <CategoriesMarquee />
        </section>
    )
}

export default Hero
