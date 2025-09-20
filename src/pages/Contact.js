import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="h-full max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-117.6px)] flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          Have questions, feedback, or need support? We’d love to hear from you.
          Get in touch with our team today.
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="py-36 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaEnvelope className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Email Us</h2>
          <p className="text-zinc-200">support@lightstore.com</p>
        </div>
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaPhoneAlt className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Call Us</h2>
          <p className="text-zinc-200">+1 (234) 567-890</p>
        </div>
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaMapMarkerAlt className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Visit Us</h2>
          <p className="text-zinc-200">123 Market Street, City, Country</p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-zinc-900 py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600 text-center mb-6">
            Send Us a Message
          </h2>
          <form className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded-md border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-teal-600"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded-md border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-teal-600"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="p-3 rounded-md border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:border-teal-600"
            />
            <button
              type="submit"
              className="bg-teal-600 hover:bg-cyan-500 text-white py-3 px-6 rounded-md font-semibold transition-all"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
