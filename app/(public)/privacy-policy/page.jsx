"use client"

import React from 'react'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl text-slate-500 font-medium  my-6 flex items-center gap-2">Privacy <span className="text-slate-700 font-medium">Policy</span></h1>
      <p className="text-gray-700 mb-4">
        At Cartiq, we value your privacy and are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
      </p>

      <h2 className="text-xl font-normal mt-6 mb-2">1. Information We Collect</h2>
      <p className="text-gray-700 mb-4">
        We may collect personal details such as your name, email address, phone number,
        and payment information when you register or make a purchase.
      </p>

      <h2 className="text-xl font-normal mt-6 mb-2">2. How We Use Your Information</h2>
      <p className="text-gray-700 mb-4">
        Your information is used to process orders, improve our services,
        and communicate updates or promotions relevant to your interests.
      </p>

      <h2 className="text-xl font-normal mt-6 mb-2">3. Data Security</h2>
      <p className="text-gray-700 mb-4">
        We use industry-standard encryption and security measures to protect your information
        from unauthorized access, disclosure, or misuse.
      </p>

      <h2 className="text-xl font-normal mt-6 mb-2">4. Your Rights</h2>
      <p className="text-gray-700 mb-4">
        You can access, modify, or delete your personal data at any time by contacting our support team.
      </p>

      <p className="text-gray-700 mt-6">
        If you have any questions about this policy, please contact us at
        <span className="font-medium"> privacy@cartiq.com</span>.
      </p>
    </div>
  )
}
