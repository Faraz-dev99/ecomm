import React from "react";
import { FaUsers, FaBullseye, FaRocket } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <div className="h-full max-md:min-h-[calc(100vh-53.6px)] md:min-h-[calc(100vh-117.6px)] flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r flex flex-col items-center from-teal-600 to-cyan-500 text-white py-16 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          We’re passionate about delivering high-quality products that bring
          value and joy to our customers. Learn more about our journey and what
          drives us.
        </p>
        <NavLink to={'/'} className=' bg-teal-100 hover:bg-white max-w-[300px] text-teal-600 py-2 px-3 rounded-md my-5 mt-10'>Get Started Now →</NavLink>
      </div>

      {/* Mission / Vision Section */}
      <div className="py-36 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaBullseye className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-zinc-200">
            To provide the best shopping experience with carefully curated
            products and top-notch service.
          </p>
        </div>
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaRocket className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p className="text-zinc-200">
            To become a trusted global marketplace where customers discover
            quality and innovation.
          </p>
        </div>
        <div className="bg-zinc-900 shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaUsers className="text-4xl text-teal-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <p className="text-zinc-200">
            We are a dedicated group of creators, designers, and developers
            working together for you.
          </p>
        </div>
      </div>

      {/* Brand / Story Section */}
      <div className="bg-zinc-900 py-28 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-6">
            Our Story
          </h2>
          <p className="text-zinc-200 text-lg leading-relaxed">
            What started as a small idea quickly grew into something bigger.
            From day one, our goal has been to create a platform where quality,
            affordability, and customer satisfaction go hand in hand. We
            constantly innovate to ensure that every interaction with our brand
            is meaningful.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
