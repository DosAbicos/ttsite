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
            © 2025 Songy. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {/* Visa */}
            <img 
              src="https://customer-assets.emergentagent.com/job_10858c60-76a7-4f64-8a00-602bbd38e584/artifacts/k1hvzw86_visa.svg" 
              alt="Visa" 
              className="h-8"
            />
            
            {/* Mastercard */}
            <img 
              src="https://customer-assets.emergentagent.com/job_10858c60-76a7-4f64-8a00-602bbd38e584/artifacts/kk6k80dd_mastercard.svg" 
              alt="Mastercard" 
              className="h-8"
            />
            
            {/* PayPal */}
            <img 
              src="https://customer-assets.emergentagent.com/job_10858c60-76a7-4f64-8a00-602bbd38e584/artifacts/buzy81bl_paypal.svg" 
              alt="PayPal" 
              className="h-8"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
