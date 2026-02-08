import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await productsAPI.getAll({ search: query, limit: 12 });
        setResults(response.data.products || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Search</h2>
          <button onClick={onClose} className="p-2 hover:opacity-70">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 border-b-2 border-black text-lg focus:outline-none"
          />
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">Searching...</div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map(product => (
              <Link 
                key={product.id}
                to={`/product/${product.slug}`}
                onClick={onClose}
                className="group"
              >
                <div className="aspect-[4/5] bg-gray-100 mb-3 overflow-hidden">
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                <p className="text-sm">
                  <span className="text-black">${product.price?.toFixed(2)} USD</span>
                  <span className="text-gray-400 line-through ml-2">${product.original_price?.toFixed(2)} USD</span>
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <p className="text-center text-gray-500">No products found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
