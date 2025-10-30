"use client"
import React from 'react'

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-medium text-slate-500 my-6 flex items-center gap-2">Contact <span className="text-slate-700 font-medium">Us</span></h1>
      <p className="text-gray-700 mb-6">
        Have a question, feedback, or need support? We'd love to hear from you.
      </p>

      <div className="space-y-3 text-gray-500">
        <p><span className='font-medium text-gray-600'>Email:</span> support@cartiq.com</p>
        <p><span className='font-medium text-gray-600'>Phone:</span> +1 (800) 555-0199</p>
        <p><span className='font-medium text-gray-600'>Address:</span> 123 Commerce Street, San Francisco, CA 94105</p>
      </div>

      <form className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-400 rounded-lg p-3"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-gray-400 rounded-lg p-3"
          required
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full border border-gray-400 rounded-lg p-3"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
