"use client"
import React from 'react'
import PageTitle from '@/components/PageTitle'

export default function PrivacyPolicy() {
  return (
    <main
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 "
      role="main"
      aria-label="Privacy Policy page content"
    >
      {/* Page title with ARIA label */}
      <header aria-label="Page title section">
        <PageTitle heading="Privacy" highlight="Policy" />
      </header>

      {/* SEO-friendly meta content */}
      <meta name="description" content="Cartiq Privacy Policy – Learn how we collect, use, and protect your personal information when using our platform." />
      <meta name="keywords" content="Cartiq, Privacy Policy, Data Protection, User Information, Security" />
      <meta name="robots" content="index, follow" />

      {/* Intro paragraph */}
      <section
        aria-labelledby="introduction"
        className="text-gray-700 mb-6 leading-relaxed"
      >
        <h2 id="introduction" className="sr-only">Introduction</h2>
        <p>
          At <strong>Cartiq</strong>, we value your privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
        </p>
      </section>

      {/* Section 1: Information We Collect */}
      <section aria-labelledby="info-we-collect" className="mb-8">
        <h2
          id="info-we-collect"
          className="text-lg font-medium mt-6 mb-2 text-gray-900"
        >
          1. Information We Collect
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We may collect personal details such as your name, email address, phone number,
          and payment information when you register or make a purchase.
        </p>
      </section>

      {/* Section 2: How We Use Your Information */}
      <section aria-labelledby="use-of-information" className="mb-8">
        <h2
          id="use-of-information"
          className="text-lg font-medium mt-6 mb-2 text-gray-900"
        >
          2. How We Use Your Information
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Your information is used to process orders, improve our services,
          and communicate updates or promotions relevant to your interests.
        </p>
      </section>

      {/* Section 3: Data Security */}
      <section aria-labelledby="data-security" className="mb-8">
        <h2
          id="data-security"
          className="text-lg font-medium mt-6 mb-2 text-gray-900"
        >
          3. Data Security
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We use industry-standard encryption and security measures to protect your information
          from unauthorized access, disclosure, or misuse.
        </p>
      </section>

      {/* Section 4: Your Rights */}
      <section aria-labelledby="user-rights" className="mb-8">
        <h2
          id="user-rights"
          className="text-lg font-medium mt-6 mb-2 text-gray-900"
        >
          4. Your Rights
        </h2>
        <p className="text-gray-700 leading-relaxed">
          You can access, modify, or delete your personal data at any time by contacting our support team.
        </p>
      </section>

      {/* Contact section */}
      <section aria-labelledby="contact-info" className="mt-8">
        <h2 id="contact-info" className="sr-only">Contact Information</h2>
        <p className="text-gray-700 leading-relaxed">
          If you have any questions about this policy, please contact us at
          <a
            href="mailto:privacy@cartiq.com"
            className="font-medium text-indigo-500 hover:underline focus:outline-none ml-1"
            aria-label="Email privacy contact at privacy@cartiq.com"
          >
            privacy@cartiq.com
          </a>.
        </p>
      </section>
    </main>
  )
}
