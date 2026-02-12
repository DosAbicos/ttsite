import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Tag } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PromoPopup = ({ productSlug }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [promo, setPromo] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadActivePromo();
  }, []);

  useEffect(() => {
    // Show popup after 2 seconds if promo exists and hasn't been dismissed
    if (promo) {
      const dismissed = sessionStorage.getItem(`promo_dismissed_${promo.code}`);
      if (!dismissed) {
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [promo]);

  const loadActivePromo = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/promo/active`);
      if (response.data) {
        setPromo(response.data);
      }
    } catch (error) {
      // No active promo
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (promo) {
      sessionStorage.setItem(`promo_dismissed_${promo.code}`, 'true');
    }
  };

  const handleCopy = () => {
    if (promo) {
      navigator.clipboard.writeText(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!promo || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl animate-fade-in"
        data-testid="promo-popup"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-black to-gray-800 p-6 text-white text-center">
          <Tag className="w-10 h-10 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-1">Special Offer!</h2>
          <p className="text-gray-300 text-sm">Limited time discount</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-4xl font-bold text-black mb-2">
            {promo.discount}% OFF
          </p>
          <p className="text-gray-600 mb-6">{promo.description || 'Use this code at checkout'}</p>

          {/* Promo Code Box */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Your promo code:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-mono font-bold tracking-wider">{promo.code}</span>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {copied && (
            <p className="text-green-600 text-sm mb-4">Code copied to clipboard!</p>
          )}

          <button
            onClick={handleClose}
            className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PromoPopup;
