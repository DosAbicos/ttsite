import React, { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart,
    cartTotal 
  } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Cart</h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is currently empty.</p>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/collections');
                  }}
                  className="text-sm underline hover:no-underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-28 object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm font-medium mb-2">
                        ${item.price.toFixed(2)} USD
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 space-y-4">
            {/* Coupon */}
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon Code"
                className="flex-1 px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black"
              />
              <button className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)} USD</span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
