'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {
    const router = useRouter();
    const [isPaused, setIsPaused] = useState(false);

    const categoryList = categories && categories.length > 0 ? categories : ["New", "Trending", "Essentials"];

    return (
        <nav
            aria-label="Product categories marquee"
            className="relative overflow-hidden w-full max-w-7xl mx-auto select-none group sm:my-20">
            {/* Left gradient overlay */}
            <div
                className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-secondary to-transparent"
                aria-hidden="true" />

            {/* Marquee container */}
            <ul
                role="list"
                className={`flex min-w-[200%] ${isPaused
                    ? "animate-none"
                    : "animate-[marqueeScroll_15s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite]"
                    } group-hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] gap-4`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
            >
                {[...categoryList, ...categoryList].map((category, index) => (
                    <li key={index}>
                        <button
                            onClick={() => router.push(`/categories/${encodeURIComponent(category)}`)}
                            className="px-5 py-2 bg-slate-100 rounded-lg text-slate-600 text-xs sm:text-sm hover:bg-primary hover:text-white active:scale-95 transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            aria-label={`View products in ${category} category`}
                        >
                            {category}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Right gradient overlay */}
            <div
                className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-secondary to-transparent"
                aria-hidden="true"
            />
        </nav>
    );
};

export default CategoriesMarquee;
