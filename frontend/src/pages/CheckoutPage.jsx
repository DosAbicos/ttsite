import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import AuthModal from '../components/auth/AuthModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, checkoutAPI } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // First create the order
      const orderData = {
        email: formData.email,
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          apartment: formData.apartment || null,
          city: formData.city,
          zip_code: formData.zipCode,
          phone: formData.phone || null,
        },
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const orderResponse = await ordersAPI.create(orderData);
      const orderId = orderResponse.data.id;

      // Create Stripe checkout session
      const originUrl = window.location.origin;
      const checkoutResponse = await checkoutAPI.createSession(orderId, originUrl);
      
      // Clear cart before redirect
      clearCart();
      
      // Redirect to Stripe checkout
      window.location.href = checkoutResponse.data.checkout_url;
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.detail || 'Failed to process checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <button
              onClick={() => navigate('/collections')}
              className="text-sm underline hover:no-underline"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shippingCost = cartTotal >= 39 ? 0 : 5.99;
  const total = cartTotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8">Checkout</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Form */}
            <div className="space-y-8">
              {/* Contact */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Contact</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Shipping */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      required
                      className="px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      required
                      className="px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP code"
                      required
                      className="px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone (optional)"
                    className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Payment</h2>
                <p className="text-gray-600 text-sm">
                  You will be redirected to Stripe's secure payment page to complete your purchase.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <svg className="h-8" viewBox="0 0 60 25" fill="none">
                    <path d="M59.64 14.28C59.64 9.37 57.29 5.45 52.76 5.45C48.21 5.45 45.44 9.37 45.44 14.24C45.44 20.06 48.66 23.07 53.35 23.07C55.63 23.07 57.39 22.53 58.73 21.78V17.93C57.39 18.59 55.84 19.01 53.89 19.01C51.97 19.01 50.27 18.33 50.06 16.01H59.6C59.6 15.74 59.64 14.77 59.64 14.28ZM50.01 12.48C50.01 10.25 51.38 9.32 52.74 9.32C54.07 9.32 55.36 10.25 55.36 12.48H50.01Z" fill="#635BFF"/>
                    <path d="M39.05 5.45C37.12 5.45 35.88 6.35 35.2 6.97L34.97 5.7H30.6V24.18L35.34 23.17L35.36 17.99C36.06 18.5 37.1 19.22 38.99 19.22C42.85 19.22 46.35 16.13 46.35 12.04C46.33 8.3 42.79 5.45 39.05 5.45ZM37.86 15.12C36.57 15.12 35.8 14.66 35.36 14.1L35.34 10.06C35.82 9.44 36.61 9.01 37.86 9.01C39.82 9.01 41.19 11.16 41.19 12.04C41.19 12.96 39.85 15.12 37.86 15.12Z" fill="#635BFF"/>
                    <path d="M25.05 4.3L29.83 3.28V-0.57L25.05 0.43V4.3Z" fill="#635BFF"/>
                    <path d="M29.83 5.7H25.05V22.82H29.83V5.7Z" fill="#635BFF"/>
                    <path d="M21.08 7.02L20.79 5.7H16.51V22.82H21.24V11.25C22.33 9.82 24.19 10.08 24.76 10.27V5.7C24.16 5.49 21.99 5.12 21.08 7.02Z" fill="#635BFF"/>
                    <path d="M11.54 2.02L6.91 3.01L6.89 18.09C6.89 20.92 9.02 23.09 11.85 23.09C13.41 23.09 14.53 22.8 15.15 22.45V18.45C14.56 18.7 11.52 19.59 11.52 16.76V9.59H15.15V5.7H11.52L11.54 2.02Z" fill="#635BFF"/>
                    <path d="M2.38 10.06C2.38 9.27 3.03 8.94 4.13 8.94C5.7 8.94 7.68 9.42 9.25 10.27V5.99C7.53 5.3 5.84 5.02 4.13 5.02C1.64 5.02 0 6.36 0 8.59C0 12.14 4.88 11.57 4.88 13.14C4.88 14.08 4.09 14.4 2.93 14.4C1.2 14.4 -0.99 13.71 -2.72 12.75V17.09C-0.8 17.91 1.1 18.26 2.93 18.26C5.49 18.26 7.24 16.97 7.24 14.7C7.22 10.82 2.38 11.53 2.38 10.06Z" fill="#635BFF"/>
                  </svg>
                  <span className="text-gray-500 text-sm">Secure payment by Stripe</span>
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}-${index}`}
                      className="flex gap-4"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover bg-gray-100 rounded"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Pay with Stripe'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <AuthModal />
    </div>
  );
};

export default CheckoutPage;
