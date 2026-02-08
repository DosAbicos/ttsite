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
              <img 
                src="https://customer-assets.emergentagent.com/job_10858c60-76a7-4f64-8a00-602bbd38e584/artifacts/lahajuui_%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD%20%D0%B1%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%284%29.png"
                alt="Songy"
                className="h-10 w-auto"
              />
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
          <div className="flex items-center gap-2">
            {/* Visa */}
            <svg className="h-8 w-12" viewBox="0 0 50 35" fill="none">
              <rect width="50" height="35" rx="4" fill="#1A1F71"/>
              <path d="M20.5 23H18L15.5 14.5L13.5 23H11L14.5 11H18L20.5 23Z" fill="white"/>
              <path d="M26 11L22 23H19.5L23.5 11H26Z" fill="white"/>
              <path d="M35 11L31 23H28.5C28.5 23 29 21 29.5 19.5C29.5 19.5 27 14 27 13.5C27 13.5 27.5 11 29.5 11H35Z" fill="white"/>
              <path d="M39 11C40.5 11 41 12 41 13C41 14 40 16 39 18C38 20 37 23 37 23H34.5L38 11H39Z" fill="white"/>
            </svg>
            
            {/* Mastercard */}
            <svg className="h-8 w-12" viewBox="0 0 50 35" fill="none">
              <rect width="50" height="35" rx="4" fill="#F5F5F5"/>
              <circle cx="18" cy="17.5" r="10" fill="#EB001B"/>
              <circle cx="32" cy="17.5" r="10" fill="#F79E1B"/>
              <path d="M25 10C27 11.5 28.5 14.2 28.5 17.5C28.5 20.8 27 23.5 25 25C23 23.5 21.5 20.8 21.5 17.5C21.5 14.2 23 11.5 25 10Z" fill="#FF5F00"/>
            </svg>
            
            {/* PayPal */}
            <svg className="h-8 w-12" viewBox="0 0 50 35" fill="none">
              <rect width="50" height="35" rx="4" fill="#F5F5F5"/>
              <path d="M19 10H23C25 10 26.5 11 26.5 13C26.5 15.5 24.5 17 22.5 17H21L20 22H17L19 10Z" fill="#003087"/>
              <path d="M28 10H32C34 10 35.5 11 35.5 13C35.5 15.5 33.5 17 31.5 17H30L29 22H26L28 10Z" fill="#009CDE"/>
            </svg>
            
            {/* Amex */}
            <svg className="h-8 w-12" viewBox="0 0 50 35" fill="none">
              <rect width="50" height="35" rx="4" fill="#006FCF"/>
              <path d="M10 15H15L16 17L17 15H22V20H17L16 18L15 20H10V15Z" fill="white"/>
              <path d="M28 15H40V20H28V15Z" fill="white"/>
              <text x="34" y="19" fontSize="6" fill="#006FCF" textAnchor="middle">AMEX</text>
            </svg>
            
            {/* Apple Pay */}
            <svg className="h-8 w-12" viewBox="0 0 50 35" fill="none">
              <rect width="50" height="35" rx="4" fill="#000"/>
              <path d="M17 12C16.5 12.5 15.5 13 15 13C15 12.5 15.5 11.5 16 11C16.5 10.5 17.5 10 18 10C18 10.5 17.5 11.5 17 12Z" fill="white"/>
              <path d="M18 13.5C17 13.5 16 14 15.5 14C14.5 14 13.5 13 12.5 13C11 13 10 14.5 10 16.5C10 19.5 12.5 23 14.5 23C15.5 23 16 22.5 17.5 22.5C19 22.5 19.5 23 20.5 23C22.5 23 24.5 19 24.5 19C23 18.5 22 17 22 15.5C22 14 23 13 24 12.5C23.5 12 22 11 20.5 11C19 11 18 13.5 18 13.5Z" fill="white"/>
              <text x="36" y="20" fontSize="7" fill="white">Pay</text>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
