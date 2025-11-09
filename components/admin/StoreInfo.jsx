'use client'
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const StoreInfo = ({ store }) => {
    const appliedDate = new Date(store.createdAt).toLocaleDateString()

    return (
        <section
            className="flex-1 space-y-2 text-sm"
            role="region"
            aria-label={`Information about ${store.name} store`}
        >
            {/* Store Logo */}
            <div className="flex justify-center sm:justify-start">
                <Image
                    width={100}
                    height={100}
                    src={store.logo}
                    alt={`${store.name} store logo`}
                    className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto"
                    priority
                />
            </div>

            {/* Store Header */}
            <div
                className="flex flex-col sm:flex-row gap-3 items-center"
                role="group"
                aria-label="Store name, username, and status"
            >
                <h3
                    className="text-xl font-semibold text-slate-800"
                    aria-label={`Store name: ${store.name}`}
                >
                    {store.name}
                </h3>

                <span
                    className="text-sm text-slate-600"
                    aria-label={`Store username: ${store.username}`}
                >
                    @{store.username}
                </span>

                {/* Status Badge */}
                <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full ${store.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : store.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                    role="status"
                    aria-live="polite"
                    aria-label={`Current status: ${store.status}`}
                >
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                </span>
            </div>

            {/* Description */}
            <p
                className="text-slate-600 my-5 max-w-2xl leading-relaxed"
                aria-label={`Description: ${store.description}`}
            >
                {store.description}
            </p>

            {/* Contact Details */}
            <address
                className="not-italic space-y-1"
                aria-label="Store contact information"
            >
                <p className="flex items-center gap-2">
                    <MapPin
                        size={16}
                        aria-hidden="true"
                        focusable="false"
                        className="shrink-0"
                    />
                    <span>{store.address}</span>
                </p>

                <p className="flex items-center gap-2">
                    <Phone
                        size={16}
                        aria-hidden="true"
                        focusable="false"
                        className="shrink-0"
                    />
                    <a
                        href={`tel:${store.contact}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                        aria-label={`Call ${store.name} at ${store.contact}`}
                    >
                        {store.contact}
                    </a>
                </p>

                <p className="flex items-center gap-2">
                    <Mail
                        size={16}
                        aria-hidden="true"
                        focusable="false"
                        className="shrink-0"
                    />
                    <a
                        href={`mailto:${store.email}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                        aria-label={`Email ${store.name} at ${store.email}`}
                    >
                        {store.email}
                    </a>
                </p>
            </address>

            {/* Submission Info */}
            <p className="text-slate-700 mt-5">
                Applied on{' '}
                <time
                    dateTime={store.createdAt}
                    className="text-xs"
                    aria-label={`Applied on ${appliedDate}`}
                >
                    {appliedDate}
                </time>{' '}
                by
            </p>

            {/* User Info */}
            <div
                className="flex items-center gap-2 text-sm"
                role="group"
                aria-label="Submitted by user information"
            >
                <Image
                    width={36}
                    height={36}
                    src={store.user.image}
                    alt={`${store.user.name}'s profile picture`}
                    className="w-9 h-9 rounded-full"
                />
                <div>
                    <p
                        className="text-slate-600 font-medium"
                        aria-label={`User name: ${store.user.name}`}
                    >
                        {store.user.name}
                    </p>
                    <p
                        className="text-slate-400"
                        aria-label={`User email: ${store.user.email}`}
                    >
                        {store.user.email}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default StoreInfo
