import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="max-w-7xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">
              <span>Light</span>
              <span className='text-sky-500'>Store</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for cutting-edge electronics and tech gadgets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1.5 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Special Offers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Support</h4>
            <ul className="space-y-1.5 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns Policy</a></li>
            </ul>
          </div>

          {/* Social Connect */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Connect With Us</h4>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-400 text-xs text-center">
              &copy; {new Date().getFullYear()} LightStore. All rights reserved.
            </p>
            
            <div className="text-gray-400 text-xs flex items-center gap-1">
              <span>Developed by</span>
              <a 
                href="https://github.com/Faraz-dev99" 
                target='_blank'
                className="hover:text-white transition-colors inline-flex items-center"
              >
                <FaGithub className="mr-1" size={12} />
                Faraz-dev99
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

//❤️