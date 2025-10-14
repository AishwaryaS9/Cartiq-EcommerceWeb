import React from 'react'
import { motion } from 'framer-motion'
import Title from './Title'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {
    return (
        <div className="px-6 my-24 max-w-6xl mx-auto">
            <Title
                visibleButton={false}
                title="Our Specifications"
                description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure, and completely hassle-free."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
                {ourSpecsData.map((spec, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="relative h-52 px-8 py-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl shadow-xs bg-white group"
                    >
                        {/* Floating Icon */}
                        <div
                            className="absolute -top-6 text-white size-12 flex items-center justify-center rounded-xl shadow-sm"
                            style={{ backgroundColor: '#6b8271' }}
                        >
                            <spec.icon size={22} />
                        </div>

                        {/* Title */}
                        <h3 className="text-slate-800 font-semibold text-lg mt-6">
                            {spec.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                            {spec.description}
                        </p>

                        {/* Accent Glow */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0"
                            style={{ backgroundColor: '#6b8271' }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default OurSpecs
