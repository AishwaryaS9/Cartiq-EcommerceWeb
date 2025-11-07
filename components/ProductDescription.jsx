'use client'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, StarIcon } from "lucide-react"

const ProductDescription = ({ product }) => {
    const tabs = ['Description', 'Reviews']

    const [selectedTab, setSelectedTab] = useState('Description')

    return (
        <section
            className="my-16 text-sm text-slate-700"
            aria-labelledby="product-info-section"
        >
            <h2 id="product-info-section" className="sr-only">
                Product Information and Reviews
            </h2>

            {/* Tabs Navigation */}
            <nav
                className="flex border-b border-slate-200 mb-6 max-w-2xl"
                role="tablist"
                aria-label="Product information tabs"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={selectedTab === tab}
                        aria-controls={`panel-${tab}`}
                        id={`tab-${tab}`}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-3 py-2 font-medium transition-colors ${selectedTab === tab
                            ? "border-b-[2px] border-primary text-primary font-semibold"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {/* Description Panel */}
            {selectedTab === "Description" && (
                <div
                    id="panel-Description"
                    role="tabpanel"
                    aria-labelledby="tab-Description"
                    className="max-w-xl"
                >
                    <p>{product.description}</p>
                </div>
            )}

            {/* Reviews Panel */}
            {selectedTab === "Reviews" && (
                <div
                    id="panel-Reviews"
                    role="tabpanel"
                    aria-labelledby="tab-Reviews"
                    className="mt-10"
                >
                    {product.rating.length === 0 ? (
                        <p>No reviews found for this product.</p>
                    ) : (
                        <ul
                            className="flex flex-col gap-6 mt-4"
                            aria-label="Customer reviews list"
                        >
                            {product.rating.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-6"
                                    aria-label={`Review by ${item.user.name}`}
                                >
                                    <Image
                                        src={item.user.image}
                                        alt={`${item.user.name}'s profile picture`}
                                        className="size-10 rounded-full ring-1 ring-gray-300"
                                        width={100}
                                        height={100}
                                    />
                                    <article>
                                        <div
                                            className="flex items-center mb-2"
                                            aria-label={`Rating: ${item.rating} out of 5`}
                                        >
                                            {Array(5)
                                                .fill("")
                                                .map((_, starIndex) => (
                                                    <StarIcon
                                                        key={starIndex}
                                                        size={18}
                                                        className="text-transparent mt-0.5"
                                                        fill={
                                                            item.rating >=
                                                                starIndex + 1
                                                                ? "#FFC107"
                                                                : "#E5E7EB"
                                                        }
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                        </div>
                                        <p className="text-sm max-w-lg mb-3 leading-relaxed">
                                            {item.review}
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {item.user.name}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </article>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Store Information */}
            <div
                className="flex items-center gap-4 mt-14"
                aria-label="Store information"
            >
                <Image
                    src={product.store.logo}
                    alt={`${product.store.name} store logo`}
                    className="size-12 rounded-full ring-1 ring-slate-200"
                    width={100}
                    height={100}
                />
                <div>
                    <p className="font-medium text-slate-700">
                        Product by{" "}
                        <span className="text-primary">
                            {product.store.name}
                        </span>
                    </p>
                    <Link
                        href={`/shop/${product.store.username}`}
                        className="flex items-center gap-1.5 text-primary font-medium hover:underline"
                        aria-label={`View ${product.store.name} store page`}
                    >
                        View store <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ProductDescription
