'use client'
import { motion } from "framer-motion";
import Head from "next/head";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

// Reusable motion variants
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function Home() {
    return (
        <>
            {/* SEO & OpenGraph */}
            <Head>
                <title>Cartiq — Shop the Latest Trends & Best-Selling Products</title>
                <meta
                    name="description"
                    content="Cartiq brings you fashion, electronics, home goods, and more. Explore our latest arrivals and best sellers with seamless shopping and exclusive deals."
                />
                <meta
                    name="keywords"
                    content="shopping, ecommerce, online store, fashion, electronics, home decor, Cartiq, deals"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Cartiq — Shop Smarter, Live Better" />
                <meta
                    property="og:description"
                    content="Shop smarter with Cartiq. From trending fashion to home and tech essentials, find everything you need in one place."
                />
                <meta property="og:image" content="/og-image.png" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Cartiq" />
                <link rel="canonical" href="https://cartiq.com/" />
            </Head>

            {/* Main Page Structure */}
            <main
                id="main-content"
                className="flex flex-col w-full min-h-screen bg-white text-gray-900"
                aria-label="Home page showcasing Cartiq products and offers"
            >
                {/* Hero Section */}
                <motion.section
                    id="hero"
                    aria-label="Featured products and promotions"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="w-full"
                >
                    <Hero />
                </motion.section>

                {/* Latest Products */}
                <motion.section
                    id="latest-products"
                    aria-label="Latest arrivals"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14"
                >
                    <motion.h2
                        className="sr-only"
                        variants={fadeUp}
                    >
                        Latest Products
                    </motion.h2>
                    <motion.div variants={fadeUp}>
                        <LatestProducts />
                    </motion.div>
                </motion.section>

                {/* Best Selling Section */}
                <motion.section
                    id="best-selling"
                    aria-label="Top selling products"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 bg-gray-50"
                >
                    <motion.h2 className="sr-only" variants={fadeUp}>
                        Best Selling Products
                    </motion.h2>
                    <motion.div variants={fadeUp}>
                        <BestSelling />
                    </motion.div>
                </motion.section>

                {/* Our Specifications / Benefits */}
                <motion.section
                    id="our-specs"
                    aria-label="Why shop with Cartiq"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14"
                >
                    <motion.h2 className="sr-only" variants={fadeUp}>
                        Our Features and Benefits
                    </motion.h2>
                    <motion.div variants={fadeUp}>
                        <OurSpecs />
                    </motion.div>
                </motion.section>

                {/* Newsletter */}
                <motion.section
                    id="newsletter"
                    aria-label="Newsletter subscription form"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14 bg-gray-100"
                >
                    <motion.h2 className="sr-only" variants={fadeUp}>
                        Subscribe to our Newsletter
                    </motion.h2>
                    <motion.div variants={fadeUp}>
                        <Newsletter />
                    </motion.div>
                </motion.section>
            </main>
        </>
    );
}
