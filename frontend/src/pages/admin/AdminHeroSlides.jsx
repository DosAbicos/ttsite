import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Save, Upload, Link, GripVertical } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    image: '',
    link: '/collections',
    order: 1
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await adminAPI.getHeroSlides();
      setSlides(response.data || []);
    } catch (error) {
      console.error('Failed to load slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      link: slide.link,
      order: slide.order
    });
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setFormData({
      image: '',
      link: '/collections',
      order: slides.length + 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        await adminAPI.updateHeroSlide(editingSlide.id, formData);
      } else {
        await adminAPI.createHeroSlide(formData);
      }
      setShowModal(false);
      loadSlides();
    } catch (error) {
      console.error('Failed to save slide:', error);
      alert(error.response?.data?.detail || 'Failed to save slide');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await adminAPI.deleteHeroSlide(id);
        loadSlides();
      } catch (error) {
        console.error('Failed to delete slide:', error);
        alert('Failed to delete slide');
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await adminAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, image: response.data.url }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="hero-slides">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="hero-slides">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hero Slides ({slides.length})</h1>
            <p className="text-gray-500 text-sm mt-1">Manage homepage carousel images</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Slide
          </button>
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-lg shadow overflow-hidden group">
              <div className="aspect-[4/5] bg-gray-100 relative">
                <img
                  src={slide.image}
                  alt={`Slide ${slide.order}`}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-3 bg-white rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm font-medium">
                  #{slide.order}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Link className="w-4 h-4" />
                  <span className="truncate">{slide.link}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No hero slides yet</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <Plus className="w-5 h-5" />
              Add Your First Slide
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl z-50">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingSlide ? 'Edit Slide' : 'Add Slide'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Slide Image</label>
                
                {/* Preview */}
                {formData.image && (
                  <div className="mb-4 relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full aspect-[4/5] object-cover rounded border"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/400x500?text=Error'}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="slide-image-upload"
                  />
                  <label
                    htmlFor="slide-image-upload"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploading 
                        ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>

                {/* URL Input */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
                    <Link className="w-4 h-4" />
                    <span>Or paste image URL:</span>
                  </div>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/collections/category-slug"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:border-black"
                />
                <p className="text-xs text-gray-500 mt-1">Where users go when clicking "Shop Collection"</p>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-24 px-3 py-2 border rounded focus:outline-none focus:border-black"
                />
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
                  disabled={!formData.image}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
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

export default AdminHeroSlides;
