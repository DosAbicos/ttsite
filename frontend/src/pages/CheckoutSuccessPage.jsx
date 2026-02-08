import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../components/layout/Header';
import { checkoutAPI } from '../services/api';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('loading');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await checkoutAPI.getStatus(sessionId);
      setPaymentInfo(response.data);
      
      if (response.data.payment_status === 'paid') {
        setStatus('success');
      } else if (response.data.status === 'expired') {
        setStatus('expired');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-lg mx-auto px-6 py-16">
        {status === 'loading' && (
          <div className="text-center">
            <Loader className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-semibold mb-2">Verifying payment...</h1>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
            {paymentInfo && (
              <p className="text-lg font-medium mb-8">
                Total paid: ${(paymentInfo.amount_total / 100).toFixed(2)} {paymentInfo.currency?.toUpperCase()}
              </p>
            )}
            <p className="text-gray-500 mb-8">
              We'll send you a confirmation email with your order details shortly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/orders')}
                className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 border border-black font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Payment Processing</h1>
            <p className="text-gray-500 mb-8">
              Your payment is being processed. This may take a moment.
            </p>
            <button
              onClick={checkPaymentStatus}
              className="w-full py-3 border border-black font-medium rounded hover:bg-gray-50 transition-colors"
            >
              Check Status Again
            </button>
          </div>
        )}

        {status === 'expired' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Session Expired</h1>
            <p className="text-gray-500 mb-8">
              Your checkout session has expired. Please try again.
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
            >
              Return to Checkout
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 border border-black font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckoutSuccessPage;
