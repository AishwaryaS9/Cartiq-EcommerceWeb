"use client"
import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
    return (
        <section
            className="w-full px-4 sm:px-6 lg:px-8 flex justify-center my-16 sm:my-20 lg:my-28"
            role="region"
            aria-label="Pricing plans section"
        >
            <div
                className="w-full max-w-[700px]"
                aria-label="Pricing table container"
            >
                <PricingTable aria-label="Pricing options" />
            </div>
        </section>
    )
}
