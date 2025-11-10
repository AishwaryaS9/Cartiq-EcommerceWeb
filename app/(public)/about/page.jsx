"use client"
import React from 'react'
import PageTitle from '@/components/PageTitle'

export default function About() {
  return (
    <main
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8"
      role="main"
      aria-label="About Cartiq page content"
    >
      {/* Page Header */}
      <header aria-label="About page title section">
        <PageTitle heading="About" highlight="Us" />
      </header>

      {/* SEO Meta Tags */}
      <meta
        name="description"
        content="Learn about Cartiq — a smart eCommerce platform designed to simplify shopping through modern design, data-driven insights, and secure experiences."
      />
      <meta
        name="keywords"
        content="Cartiq, About Us, eCommerce, Smart Shopping, Online Store, Product Recommendations, Secure Transactions"
      />
      <meta name="robots" content="index, follow" />

      {/* About Content */}
      <section
        aria-labelledby="about-intro"
        className="text-gray-700 leading-relaxed mb-6"
      >
        <h2 id="about-intro" className="sr-only">Introduction</h2>
        <p>
          Welcome to <strong>Cartiq</strong> — your trusted eCommerce platform for smart shopping.
          We believe in simplifying your online shopping experience by combining
          modern design, intelligent product recommendations, and secure transactions.
        </p>
      </section>

      <section
        aria-labelledby="mission"
        className="text-gray-700 leading-relaxed mb-6"
      >
        <h2 id="mission" className="text-lg font-medium text-gray-900 mb-2">
          Our Mission
        </h2>
        <p>
          Our mission is to make online shopping more intuitive and enjoyable.
          From discovery to checkout, we use data-driven insights to bring you
          personalized experiences and the best product deals.
        </p>
      </section>

      <section
        aria-labelledby="vision"
        className="text-gray-700 leading-relaxed"
      >
        <h2 id="vision" className="text-lg font-medium text-gray-900 mb-2">
          Our Vision
        </h2>
        <p>
          Whether you're a customer looking for quality products or a business
          aiming to expand online, <strong>Cartiq</strong> is here to help you shop
          and sell smarter.
        </p>
      </section>
    </main>
  )
}
