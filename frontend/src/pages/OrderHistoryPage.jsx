import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' }
};

const OrderHistoryPage = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      openAuthModal();
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your orders</h1>
          <p className="text-gray-500 mb-6">Track your orders and view purchase history</p>
          <button
            onClick={openAuthModal}
            className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">Order History</span>
        </nav>

        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link
              to="/collections"
              className="inline-block px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <div 
                  key={order.id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Order Number</p>
                        <p className="font-mono font-medium">{order.id?.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Date</p>
                        <p className="font-medium">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Total</p>
                        <p className="font-bold">${order.total?.toFixed(2)} USD</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' / '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="font-medium mt-1">${item.price?.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-xs text-gray-500 uppercase mb-2">Shipping Address</p>
                        <p className="text-sm">
                          {order.shipping_address.name}<br />
                          {order.shipping_address.address}<br />
                          {order.shipping_address.city}, {order.shipping_address.country} {order.shipping_address.postal_code}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
