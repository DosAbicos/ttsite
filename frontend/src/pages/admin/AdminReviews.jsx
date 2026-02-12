import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Star, Upload, Image } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    user_name: '',
    rating: 5,
    title: '',
    comment: '',
    images: [],
    verified_purchase: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsRes, productsRes] = await Promise.all([
        adminAPI.getReviews(),
        adminAPI.getProducts()
      ]);
      setReviews(reviewsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReview(null);
    setFormData({
      product_id: products[0]?.id || '',
      user_name: '',
      rating: 5,
      title: '',
      comment: '',
      images: [],
      verified_purchase: true
    });
    setShowModal(true);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      product_id: review.product_id,
      user_name: review.user_name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images || [],
      verified_purchase: review.verified_purchase
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadPromises = files.map(file => adminAPI.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.data.url);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
    } catch (error) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await adminAPI.updateReview(editingReview.id, formData);
      } else {
        await adminAPI.createReview(formData);
      }
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to save review:', error);
      alert(error.response?.data?.detail || 'Failed to save review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await adminAPI.deleteReview(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <AdminLayout activeTab="reviews">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="reviews">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reviews ({reviews.length})</h1>
            <p className="text-gray-500 text-sm mt-1">Manage product reviews</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Review
          </button>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No reviews yet. Click "Add Review" to create one.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{getProductName(review.product_id)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{review.user_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex">{renderStars(review.rating)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{review.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      {review.verified_purchase ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Yes</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded mr-2"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl z-50">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingReview ? 'Edit Review' : 'Add Review'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product */}
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Reviewer Name</label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                  placeholder="John D."
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Review Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Great product!"
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Write the review text..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black resize-none"
                />
              </div>

              {/* Verified Purchase */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified_purchase}
                  onChange={(e) => setFormData(prev => ({ ...prev, verified_purchase: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="verified" className="text-sm">
                  Show as "Verified Purchase"
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;
