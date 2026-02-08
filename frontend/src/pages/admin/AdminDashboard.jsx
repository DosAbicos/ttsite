import React, { useState, useEffect } from 'react';
import { Package, FolderTree, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Products', value: stats?.products || 0, icon: Package, color: 'bg-blue-500' },
    { label: 'Categories', value: stats?.categories || 0, icon: FolderTree, color: 'bg-green-500' },
    { label: 'Orders', value: stats?.orders || 0, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Users', value: stats?.users || 0, icon: Users, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">${stats?.total_revenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-emerald-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="p-6">
            {stats?.recent_orders?.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{order.email}</p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
