import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { languages } from '../../data/mock';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../search/SearchModal';

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, openAuthModal } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLangSelect = (lang) => {
    setCurrentLang(lang.name);
    setIsLangOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white">
        {/* Top announcement bar */}
        <div className="bg-white border-b border-gray-100 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8 text-xs font-medium tracking-wide text-black">
                <span className="italic">FREE SHIPPING OVER $39 (LIMITED TIME)</span>
                <span className="mx-8 italic">45-DAY FREE RETURNS AND EXCHANGES</span>
              </span>
            ))}
          </div>
        </div>

        {/* Language selector bar */}
        <div className="flex justify-end px-6 py-1 border-b border-gray-100">
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors"
            >
              {currentLang}
              <ChevronDown className="w-3 h-3" />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-40 max-h-60 overflow-y-auto z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangSelect(lang)}
                    className="w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 transition-colors"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left - Navigation */}
          <nav className="flex-1">
            <Link 
              to="/" 
              className="text-sm font-medium text-black hover:opacity-70 transition-opacity"
            >
              HOME
            </Link>
          </nav>

          {/* Center - Logo */}
          <Link to="/" className="flex-shrink-0">
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

          {/* Right - Icons */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => user ? null : openAuthModal('login')}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:opacity-70 transition-opacity relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
