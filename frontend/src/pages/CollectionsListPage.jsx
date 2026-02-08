import React from 'react';
import Header from '../components/layout/Header';
import AuthModal from '../components/auth/AuthModal';
import { Link } from 'react-router-dom';
import { categories } from '../data/mock';

const CollectionsListPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-12">
        <h1 className="text-3xl font-serif text-center mb-12">All Collections</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/collections/${category.slug}`}
              className="group text-center"
            >
              <div className="aspect-square bg-gray-50 overflow-hidden rounded-lg mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h2 className="text-lg font-medium group-hover:underline">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </main>

      <AuthModal />
    </div>
  );
};

export default CollectionsListPage;
