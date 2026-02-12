import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, ChevronDown, Settings, LogOut, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { languages } from '../../data/mock';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../search/SearchModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Header = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [marqueeTexts, setMarqueeTexts] = useState([
    { id: '1', text: 'FREE SHIPPING OVER $39 (LIMITED TIME)' },
    { id: '2', text: '45-DAY FREE RETURNS AND EXCHANGES' }
  ]);

  useEffect(() => {
    loadMarqueeTexts();
  }, []);

  const loadMarqueeTexts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/marquee`);
      if (response.data && response.data.length > 0) {
        setMarqueeTexts(response.data);
      }
    } catch (error) {
      // Use defaults
    }
  };

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
            <img 
              src="https://customer-assets.emergentagent.com/job_10858c60-76a7-4f64-8a00-602bbd38e584/artifacts/lahajuui_%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD%20%D0%B1%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%284%29.png"
              alt="Songy"
              className="h-10 w-auto"
            />
          </Link>

          {/* Right - Icons */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : openAuthModal('login')}
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <User className="w-5 h-5" />
              </button>
              
              {user && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-48 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/orders');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </button>
                  {user.is_admin && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/admin');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            
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
