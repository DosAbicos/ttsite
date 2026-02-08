import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <svg viewBox="0 0 120 50" className="h-10 w-auto">
                <ellipse cx="60" cy="25" rx="55" ry="20" fill="none" stroke="black" strokeWidth="2"/>
                <text x="60" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif">ddebuut</text>
                <line x1="10" y1="10" x2="25" y2="20" stroke="black" strokeWidth="2"/>
                <line x1="110" y1="10" x2="95" y2="20" stroke="black" strokeWidth="2"/>
                <line x1="10" y1="40" x2="25" y2="30" stroke="black" strokeWidth="2"/>
                <line x1="110" y1="40" x2="95" y2="30" stroke="black" strokeWidth="2"/>
                <circle cx="60" cy="40" r="3" fill="black"/>
              </svg>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Premium streetwear and vintage-inspired clothing. Quality craftsmanship meets contemporary design.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/collections" className="hover:text-black transition-colors">Shop All</Link></li>
              <li><Link to="/collections/retro-series" className="hover:text-black transition-colors">Retro Series</Link></li>
              <li><Link to="/collections/tops" className="hover:text-black transition-colors">Tops</Link></li>
              <li><Link to="/collections/down-jacket" className="hover:text-black transition-colors">Jackets</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-black transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-black transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-black transition-colors cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-black transition-colors cursor-pointer">Size Guide</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 ddebuut. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Visa */}
            <img 
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/Assets/card-visa.svg" 
              alt="Visa" 
              className="h-8"
            />
            {/* Mastercard */}
            <img 
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/Assets/card-mastercard.svg" 
              alt="Mastercard" 
              className="h-8"
            />
            {/* PayPal */}
            <img 
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/Assets/payment-paypal.svg" 
              alt="PayPal" 
              className="h-8"
            />
            {/* Apple Pay */}
            <img 
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/Assets/payment-apple-pay.svg" 
              alt="Apple Pay" 
              className="h-8"
            />
            {/* Google Pay */}
            <img 
              src="https://cdn.jsdelivr.net/gh/lipis/payment-icons@master/Assets/payment-google-pay.svg" 
              alt="Google Pay" 
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
