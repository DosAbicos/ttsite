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
          <div className="flex items-center gap-4">
            {/* Payment icons */}
            <div className="flex items-center gap-2">
              <svg className="h-6" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <path d="M15.5 17.5H13.5L14.75 6.5H16.75L15.5 17.5Z" fill="white"/>
                <path d="M23.5 6.7C23.1 6.55 22.45 6.4 21.65 6.4C19.65 6.4 18.25 7.45 18.25 8.95C18.25 10.05 19.25 10.65 20 11.05C20.75 11.45 21.05 11.7 21.05 12.05C21.05 12.55 20.45 12.8 19.9 12.8C19.1 12.8 18.65 12.65 18 12.35L17.7 12.2L17.4 14.05C17.85 14.25 18.7 14.45 19.6 14.45C21.75 14.45 23.1 13.4 23.1 11.8C23.1 10.95 22.55 10.3 21.4 9.75C20.7 9.4 20.3 9.15 20.3 8.75C20.3 8.4 20.7 8.05 21.5 8.05C22.15 8.05 22.65 8.2 23.05 8.35L23.25 8.45L23.5 6.7Z" fill="white"/>
                <path d="M27.25 6.5H25.75C25.25 6.5 24.9 6.65 24.7 7.15L21.75 14.4H23.9L24.35 13.1H26.95L27.2 14.4H29.1L27.25 6.5ZM24.95 11.45C25.15 10.9 25.8 9.05 25.8 9.05C25.8 9.05 25.95 8.6 26.05 8.3L26.2 8.95C26.2 8.95 26.6 10.7 26.7 11.45H24.95Z" fill="white"/>
                <path d="M12.8 6.5L10.85 12.35L10.6 11.1C10.15 9.6 8.75 7.95 7.2 7.15L9.05 14.35H11.2L15 6.5H12.8Z" fill="white"/>
                <path d="M9.25 6.5H5.85L5.8 6.7C8.35 7.35 10.05 9 10.6 11.1L9.95 7.2C9.85 6.7 9.5 6.55 9.05 6.5H9.25Z" fill="#F9A533"/>
              </svg>
              <svg className="h-6" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#252525"/>
                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 7C20.5 8.3 21.5 10 21.5 12C21.5 14 20.5 15.7 19 17C17.5 15.7 16.5 14 16.5 12C16.5 10 17.5 8.3 19 7Z" fill="#FF5F00"/>
              </svg>
              <svg className="h-6" viewBox="0 0 38 24" fill="none">
                <rect width="38" height="24" rx="4" fill="#003087"/>
                <path d="M14.5 10.5H12.5C12.3 10.5 12.1 10.65 12.05 10.85L11.3 15.35C11.25 15.5 11.35 15.6 11.5 15.6H12.45C12.6 15.6 12.7 15.5 12.75 15.35L12.95 14.05C13 13.85 13.2 13.7 13.4 13.7H14.15C15.6 13.7 16.45 13 16.65 11.6C16.75 11 16.65 10.5 16.4 10.15C16.1 9.75 15.55 10.5 14.5 10.5Z" fill="white"/>
                <path d="M22.5 10.5H20.5C20.3 10.5 20.1 10.65 20.05 10.85L19.3 15.35C19.25 15.5 19.35 15.6 19.5 15.6H20.55C20.7 15.6 20.85 15.5 20.9 15.3L21 14.05C21.05 13.85 21.25 13.7 21.45 13.7H22.2C23.65 13.7 24.5 13 24.7 11.6C24.8 11 24.7 10.5 24.45 10.15C24.15 9.75 23.6 10.5 22.5 10.5Z" fill="#009CDE"/>
                <path d="M27.05 8.5H25.05C24.85 8.5 24.65 8.65 24.6 8.85L23.85 13.35C23.8 13.5 23.9 13.6 24.05 13.6H25.2C25.3 13.6 25.4 13.55 25.4 13.45L25.65 12C25.7 11.8 25.9 11.65 26.1 11.65H26.85C28.3 11.65 29.15 10.95 29.35 9.55C29.45 8.95 29.35 8.45 29.1 8.1C28.8 7.7 28.15 8.5 27.05 8.5Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
