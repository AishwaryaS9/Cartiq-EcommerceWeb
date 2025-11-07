'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {
    const isLink = visibleButton && href

    return (
        <header
            className="flex flex-col items-center text-center px-4 py-6 sm:py-8"
            role="banner"
            aria-label={`Section title: ${title}`}
        >
            {/* Section Heading */}
            <h2
                id={`${title.replace(/\s+/g, '-').toLowerCase()}-title`}
                className="text-2xl sm:text-2xl font-semibold text-slate-800 tracking-tight"
            >
                {title}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-lg">
                {description}
            </p>

            {isLink && (
                <Link
                    href={href}
                    aria-label={`View more about ${title}`}
                    className="group inline-flex items-center gap-2 mt-4 text-primary font-medium text-sm hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full px-2 py-1 transition-colors duration-200"
                >
                    View more
                    <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                    />
                </Link>
            )}
        </header>
    )
}

export default Title
