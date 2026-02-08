import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import QuickViewModal from '../product/QuickViewModal';

const ProductGrid = ({ title, category, limit }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (limit) params.limit = limit;
      
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  if (loading) {
    return (
      <section className="py-12 px-6">
        {title && (
          <h2 className="text-center text-2xl font-serif mb-8">{title}</h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-gray-200 rounded"></div>
              <div className="mt-3 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6">
      {title && (
        <h2 className="text-center text-2xl font-serif mb-8">{title}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link
              to={`/product/${product.slug}`}
              className="block relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                <img
                  src={hoveredProduct === product.id && product.images?.[1] ? product.images[1] : product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Quick view"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>

            <div className="mt-3">
              <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  ${product.price?.toFixed(2)} USD
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.original_price?.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">No products found</p>
      )}

      {category && products.length > 0 && (
        <div className="text-center mt-8">
          <Link
            to={`/collections/${category}`}
            className="inline-block px-8 py-3 border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  );
};

export default ProductGrid;
