"use client"
import React from 'react'
import PageTitle from '@/components/PageTitle'
import toast from 'react-hot-toast';

export default function Contact() {

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Message sent successfully!");
    } else {
      toast.error("Failed to send message");
    }
    event.target.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <PageTitle
        heading="Contact"
        highlight="Us"
      />
      <p className="text-gray-700 mb-6">
        Have a question, feedback, or need support? We'd love to hear from you.
      </p>

      <div className="space-y-3 text-gray-500">
        <p><span className='font-medium text-gray-600'>Email:</span> support@cartiq.com</p>
        <p><span className='font-medium text-gray-600'>Phone:</span> +1 (800) 555-0199</p>
        <p><span className='font-medium text-gray-600'>Address:</span> 123 Commerce Street, San Francisco, CA 94105</p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary"
          required
          name='name'
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary"
          required
          name='email'
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full border border-gray-400 rounded-lg p-3 outline-none focus:border-primary"
          required
          name='message'
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
