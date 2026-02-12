import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Percent } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminPromos = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: 10,
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const response = await adminAPI.getPromos();
      setPromos(response.data || []);
    } catch (error) {
      console.error('Failed to load promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await adminAPI.updatePromo(editingPromo.id, formData);
      } else {
        await adminAPI.createPromo(formData);
      }
      setShowForm(false);
      setEditingPromo(null);
      setFormData({ code: '', discount: 10, description: '', is_active: true });
      loadPromos();
    } catch (error) {
      alert(error.response?.data?.detail || 'Error saving promo');
    }
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      discount: promo.discount,
      description: promo.description || '',
      is_active: promo.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await adminAPI.deletePromo(id);
      loadPromos();
    } catch (error) {
      alert('Error deleting promo');
    }
  };

  const toggleActive = async (promo) => {
    try {
      await adminAPI.updatePromo(promo.id, { ...promo, is_active: !promo.is_active });
      loadPromos();
    } catch (error) {
      alert('Error updating promo');
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="promos">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="promos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Promo Codes</h1>
          <button
            onClick={() => {
              setEditingPromo(null);
              setFormData({ code: '', discount: 10, description: '', is_active: true });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Add Promo
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">
              {editingPromo ? 'Edit Promo Code' : 'New Promo Code'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SAVE10"
                    required
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                    required
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (shown in popup)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Use this code at checkout for extra savings!"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-black"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm">Active (shows popup on product pages)</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  {editingPromo ? 'Save Changes' : 'Create Promo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPromo(null);
                  }}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Promos List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {promos.length > 0 ? (
                promos.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="font-mono font-semibold">{promo.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Percent className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">{promo.discount}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {promo.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(promo)}
                        className={`px-3 py-1 text-xs rounded-full ${
                          promo.is_active
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No promo codes yet. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPromos;
