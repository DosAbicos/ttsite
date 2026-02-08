import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/mock';

const CategoryCarousel = () => {
  const scrollRef = useRef(null);

  // Duplicate for infinite scroll effect
  const extendedCategories = [...categories, ...categories];

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
