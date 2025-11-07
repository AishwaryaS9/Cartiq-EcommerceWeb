'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {
    return (
        <section
            className="px-6 my-10 max-w-6xl mx-auto"
            aria-labelledby="our-specs-title"
            role="region"
        >
            {/* Accessible Section Title */}
            <header>
                <Title
                    id="our-specs-title"
                    visibleButton={false}
                    title="Our Specifications"
                    description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure, and completely hassle-free."
                />
            </header>

            {/* Specs Grid */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16"
                role="list"
                aria-label="Our key specifications"
            >
                {ourSpecsData.map((spec, index) => (
                    <motion.article
                        key={spec.title || index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className="relative h-52 px-8 py-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl shadow-xs bg-white group"
                        role="listitem"
                        tabIndex={0}
                        aria-label={`${spec.title}: ${spec.description}`}
                    >
                        {/* Floating Icon */}
                        <div
                            className="absolute -top-6 size-12 flex items-center justify-center rounded-xl shadow-sm text-white"
                            style={{ backgroundColor: '#6b8271' }}
                            aria-hidden="true"
                        >
                            <spec.icon size={22} aria-hidden="true" />
                        </div>

                        {/* Title */}
                        <h3 className="text-slate-700 font-medium text-lg mt-6">
                            {spec.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                            {spec.description}
                        </p>

                        {/* Decorative Accent Glow */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                            style={{ backgroundColor: '#6b8271' }}
                            aria-hidden="true"
                        />
                    </motion.article>
                ))}
            </div>
        </section>
    )
}

export default OurSpecs
