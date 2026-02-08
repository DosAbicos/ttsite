import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';

const RecommendedProducts = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentProductId]);

  const loadRecommendations = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 5 });
      // Filter out current product and take 4
      const filtered = (response.data.products || [])
        .filter(p => p.id !== currentProductId)
        .slice(0, 4);
      setProducts(filtered);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 px-6">
      <h2 className="text-2xl font-serif mb-8">You May Also Like</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const discount = Math.round((1 - product.price / product.original_price) * 100);
          const isOnSale = discount > 0;
          
          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden mb-3">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isOnSale && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium mb-1 truncate">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  ${product.price?.toFixed(2)} USD
                </span>
                {isOnSale && (
                  <span className="text-sm text-gray-400 line-through">
                    ${product.original_price?.toFixed(2)} USD
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendedProducts;
