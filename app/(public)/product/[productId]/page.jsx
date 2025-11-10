'use client'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "next/navigation"
import Head from "next/head"
import ProductDescription from "@/components/ProductDescription"
import ProductDetails from "@/components/ProductDetails"

export default function Product() {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const products = useSelector((state) => state.product.list)

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find((p) => p.id === productId)
            setProduct(foundProduct)
        }
        window.scrollTo(0, 0)
    }, [productId, products])

    const productSchema = product
        ? {
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.image || "",
            description: product.description || "",
            sku: product.id,
            category: product.category,
            offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: product.price,
                availability: "https://schema.org/InStock",
            },
        }
        : null

    return (
        <>
            {/* SEO Metadata */}
            <Head>
                <title>
                    {product
                        ? `${product.name} | ${product.category} | My Store`
                        : "Product | My Store"}
                </title>
                <meta
                    name="description"
                    content={
                        product?.description
                            ? product.description.slice(0, 155)
                            : "View product details, reviews, and specifications."
                    }
                />
                <meta
                    property="og:title"
                    content={
                        product
                            ? `${product.name} | ${product.category}`
                            : "Product | My Store"
                    }
                />
                <meta
                    property="og:description"
                    content={product?.description || "Product details and reviews."}
                />
                <meta property="og:type" content="product" />
                <meta property="og:url" content={`https://yourdomain.com/product/${productId}`} />
                {product?.image && (
                    <meta property="og:image" content={product.image} />
                )}
                {productSchema && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
                    />
                )}
            </Head>

            <main
                className="mx-4 sm:mx-6 lg:mx-10"
                role="main"
                aria-label={`Product details page for ${product?.name || 'selected item'}`}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav
                        className="flex flex-wrap items-center gap-1 text-customBlack text-sm mt-8 mb-5"
                        aria-label="Breadcrumb"
                    >
                        <a
                            href="/"
                            className="text-gray-600 hover:text-primary px-1"
                            aria-label="Go to Home page"
                        >
                            Home
                        </a>
                        <span aria-hidden="true" className="text-gray-400">
                            ›
                        </span>
                        <a
                            href="/shop"
                            className="text-gray-600 hover:text-primary  px-1"
                            aria-label="Go to Products page"
                        >
                            Products
                        </a>
                        {product?.category && (
                            <>
                                <span aria-hidden="true" className="text-gray-400">
                                    ›
                                </span>
                                <a
                                    href="#"
                                    className="text-primary font-medium  px-1"
                                    aria-current="page"
                                >
                                    {product.category}
                                </a>
                            </>
                        )}
                    </nav>

                    {/* Product Details */}
                    {product ? (
                        <section
                            aria-label={`${product.name} details`}
                            className="mb-12"
                        >
                            <ProductDetails product={product} />
                        </section>
                    ) : (
                        <div
                            role="status"
                            aria-live="polite"
                            className="text-center py-20 text-gray-600"
                        >
                            <p>Loading product details...</p>
                        </div>
                    )}

                    {/* Product Description & Reviews */}
                    {product && (
                        <section
                            aria-label={`${product.name} description and reviews`}
                            className="mb-16"
                        >
                            <ProductDescription product={product} />
                        </section>
                    )}
                </div>
            </main>
        </>
    )
}
