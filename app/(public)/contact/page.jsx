"use client"
import React from 'react'
import toast from 'react-hot-toast'
import PageTitle from '@/components/PageTitle'

export default function Contact() {
  const onSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY)

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })

    const data = await response.json()
    if (data.success) {
      toast.success("Message sent successfully!")
    } else {
      toast.error("Failed to send message")
    }
    event.target.reset()
  }

  return (
    <main
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8"
      role="main"
      aria-label="Contact Cartiq page content"
    >
      {/* Page Title */}
      <header aria-label="Contact page title section">
        <PageTitle heading="Contact" highlight="Us" />
      </header>

      {/* SEO meta tags */}
      <meta
        name="description"
        content="Get in touch with Cartiq for support, feedback, or partnership inquiries. Contact us by email, phone, or using our secure contact form."
      />
      <meta
        name="keywords"
        content="Cartiq, Contact Us, Support, Customer Service, Help, eCommerce Contact"
      />
      <meta name="robots" content="index, follow" />

      {/* Intro text */}
      <section
        aria-labelledby="contact-intro"
        className="text-gray-700 leading-relaxed mb-6"
      >
        <h2 id="contact-intro" className="sr-only">Introduction</h2>
        <p>
          Have a question, feedback, or need support? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Information */}
      <section
        aria-labelledby="contact-info"
        className="space-y-3 text-gray-600 mb-10"
      >
        <h2 id="contact-info" className="text-xl font-medium text-gray-900 mb-2">
          Contact Information
        </h2>
        <p>
          <span className="font-medium text-gray-800">Email:</span>{' '}
          <a
            href="mailto:support@cartiq.com"
            className="text-slate-600  hover:underline focus:outline-none"
            aria-label="Send an email to support at Cartiq"
          >
            support@cartiq.com
          </a>
        </p>
        <p>
          <span className="font-medium text-gray-800">Phone:</span>{' '}
          <a
            href="tel:+18005550199"
            className="text-slate-600 hover:underline focus:outline-none"
            aria-label="Call Cartiq support at +1 800 555 0199"
          >
            +1 (800) 555-0199
          </a>
        </p>
        <p>
          <span className="font-medium text-gray-800">Address:</span>{' '}
          <address className="not-italic">
            123 Commerce Street, San Francisco, CA 94105
          </address>
        </p>
      </section>

      {/* Contact Form */}
      <section
        aria-labelledby="contact-form"
        className="mt-8"
      >
        <h2 id="contact-form" className="text-xl font-medium text-gray-900 mb-4">
          Send Us a Message
        </h2>
        <form
          className="space-y-4"
          onSubmit={onSubmit}
          aria-label="Contact form"
        >
          <div>
            <label htmlFor="name" className="sr-only">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="bg-primary font-medium text-white px-6 py-3 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary transition w-full sm:w-auto"
            aria-label="Send message button"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  )
}
