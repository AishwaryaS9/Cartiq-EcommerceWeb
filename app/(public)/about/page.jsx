"use client"

import React from 'react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-medium text-slate-500 my-6 flex items-center gap-2">About <span className="text-slate-700 font-medium">Us</span></h1>
      <p className="text-gray-700 mb-4">
        Welcome to Cartiq — your trusted eCommerce platform for smart shopping.
        We believe in simplifying your online shopping experience by combining
        modern design, intelligent product recommendations, and secure transactions.
      </p>
      <p className="text-gray-700 mb-4">
        Our mission is to make online shopping more intuitive and enjoyable.
        From discovery to checkout, we use data-driven insights to bring you
        personalized experiences and the best product deals.
      </p>
      <p className="text-gray-700">
        Whether you're a customer looking for quality products or a business
        aiming to expand online, Cartiq is here to help you shop and sell smarter.
      </p>
    </div>
  )
}
