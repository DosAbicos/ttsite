import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';

const AdminMarquee = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMarqueeTexts();
  }, []);

  const loadMarqueeTexts = async () => {
    try {
      const response = await adminAPI.getMarqueeTexts();
      if (response.data && response.data.length > 0) {
        setTexts(response.data);
      } else {
        // Default texts
        setTexts([
          { id: '1', text: 'FREE SHIPPING OVER $39 (LIMITED TIME)' },
          { id: '2', text: '45-DAY FREE RETURNS AND EXCHANGES' }
        ]);
      }
    } catch (error) {
      // Use defaults if API fails
      setTexts([
        { id: '1', text: 'FREE SHIPPING OVER $39 (LIMITED TIME)' },
        { id: '2', text: '45-DAY FREE RETURNS AND EXCHANGES' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const addText = () => {
    setTexts([...texts, { id: Date.now().toString(), text: '' }]);
  };

  const removeText = (id) => {
    setTexts(texts.filter(t => t.id !== id));
  };

  const updateText = (id, newText) => {
    setTexts(texts.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await adminAPI.updateMarqueeTexts(texts.filter(t => t.text.trim()));
      setMessage('Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab="marquee">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="marquee">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Marquee Text</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-4">
            These texts will scroll in the announcement bar at the top of the site.
          </p>

          <div className="space-y-3">
            {texts.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateText(item.id, e.target.value)}
                  placeholder="Enter announcement text..."
                  className="flex-1 px-4 py-2 border rounded focus:outline-none focus:border-black"
                />
                <button
                  onClick={() => removeText(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  disabled={texts.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addText}
            className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            <Plus className="w-4 h-4" />
            Add Another Text
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-3">Preview</h2>
          <div className="bg-gray-100 overflow-hidden rounded">
            <div className="animate-marquee whitespace-nowrap py-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="mx-8 text-xs font-medium tracking-wide text-black">
                  {texts.filter(t => t.text.trim()).map((t, idx) => (
                    <span key={idx}>
                      <span className="italic">{t.text}</span>
                      {idx < texts.filter(t => t.text.trim()).length - 1 && <span className="mx-8">|</span>}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMarquee;
