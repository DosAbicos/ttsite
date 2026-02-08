import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../../services/api';

const CategoryCarousel = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate for infinite scroll effect
  const extendedCategories = [...categories, ...categories];

  if (loading) {
    return (
      <section className="py-12">
        <h2 className="text-center text-2xl font-serif mb-8">Recommended</h2>
        <div className="flex gap-6 px-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200"></div>
              <div className="mt-3 h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-center text-2xl font-serif mb-8">Recommended</h2>
      
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-6 px-6 pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {extendedCategories.map((category, index) => (
          <Link
            key={`${category.id}-${index}`}
            to={`/collections/${category.slug}`}
            className="flex-shrink-0 group text-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-100 mx-auto mb-3 transition-all duration-300 group-hover:border-black group-hover:shadow-lg">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <p className="text-sm font-medium text-gray-800 group-hover:text-black transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryCarousel;
