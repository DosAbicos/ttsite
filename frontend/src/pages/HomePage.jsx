import React from 'react';
import Header from '../components/layout/Header';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryCarousel from '../components/home/CategoryCarousel';
import ProductGrid from '../components/home/ProductGrid';
import PromoModal from '../components/promo/PromoModal';
import AuthModal from '../components/auth/AuthModal';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroCarousel />
        <CategoryCarousel />
        <ProductGrid title="Retro Series" category="retro-series" limit={12} />
      </main>

      <PromoModal />
      <AuthModal />
    </div>
  );
};

export default HomePage;
