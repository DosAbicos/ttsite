import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { promoCode } from '../../data/mock';

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenPromo', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promoCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50">
        <div 
          className="relative mx-4 rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fce7f3 0%, #f5d0fe 50%, #e9d5ff 100%)'
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <svg viewBox="0 0 120 50" className="h-12 w-auto">
                <ellipse cx="60" cy="25" rx="55" ry="20" fill="none" stroke="black" strokeWidth="2"/>
                <text x="60" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="serif">ddebuut</text>
                <line x1="10" y1="10" x2="25" y2="20" stroke="black" strokeWidth="2"/>
                <line x1="110" y1="10" x2="95" y2="20" stroke="black" strokeWidth="2"/>
                <line x1="10" y1="40" x2="25" y2="30" stroke="black" strokeWidth="2"/>
                <line x1="110" y1="40" x2="95" y2="30" stroke="black" strokeWidth="2"/>
                <circle cx="60" cy="40" r="3" fill="black"/>
              </svg>
            </div>

            {/* Discount */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#ec4899] mb-4">
              {promoCode.discount}
            </h2>

            {/* Message */}
            <p className="text-[#be185d] mb-6">
              {promoCode.message}
            </p>

            {/* Coupon Code */}
            <div 
              onClick={handleCopy}
              className="flex items-center justify-center gap-3 bg-white rounded-full px-6 py-3 mx-auto max-w-xs cursor-pointer hover:shadow-md transition-shadow mb-6"
            >
              <span className="text-[#ec4899]">%</span>
              <span className="font-semibold tracking-wider">{promoCode.code}</span>
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* Shop Now Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full max-w-xs py-3 bg-[#ec4899] text-white font-semibold rounded hover:bg-[#db2777] transition-colors"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoModal;
