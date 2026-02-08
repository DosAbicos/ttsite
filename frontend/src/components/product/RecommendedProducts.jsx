import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { productsAPI } from '../../services/api';

const RecommendedProducts = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadRecommendations();
  }, [currentProductId]);

  const loadRecommendations = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 10 });
      // Filter out current product
      const filtered = (response.data.products || [])
        .filter(p => p.id !== currentProductId);
      setProducts(filtered);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif">You May Also Like</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 border border-gray-200 rounded-full hover:border-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 border border-gray-200 rounded-full hover:border-black transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => {
          const discount = Math.round((1 - product.price / product.original_price) * 100);
          const isOnSale = discount > 0;
          
          return (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="flex-shrink-0 w-64 group"
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
