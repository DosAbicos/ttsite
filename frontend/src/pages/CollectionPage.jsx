import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, Search, ShoppingBag } from 'lucide-react';
import Header from '../components/layout/Header';
import AuthModal from '../components/auth/AuthModal';
import QuickViewModal from '../components/product/QuickViewModal';
import { products, categories } from '../data/mock';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CollectionPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('recommended');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const category = categories.find(c => c.slug === slug);

  // For now, show all products for any collection
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    if (priceRange === 'under10') {
      result = result.filter(p => p.price < 10);
    } else if (priceRange === '10to50') {
      result = result.filter(p => p.price >= 10 && p.price <= 50);
    } else if (priceRange === 'over50') {
      result = result.filter(p => p.price > 50);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-az') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-za') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [priceRange, sortBy]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-8">
        {/* Filters Row */}
        <div className="flex items-center justify-between mb-8">
          {/* Left filters */}
          <div className="flex items-center gap-6">
            {/* Availability Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsAvailabilityOpen(!isAvailabilityOpen);
                  setIsPriceOpen(false);
                  setIsSortOpen(false);
                }}
                className="flex items-center gap-2 text-sm"
              >
                Availability
                <ChevronDown className="w-4 h-4" />
              </button>
              {isAvailabilityOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-40 z-20">
                  <button
                    onClick={() => {
                      setFilterAvailability('all');
                      setIsAvailabilityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      filterAvailability === 'all' ? 'font-medium' : ''
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      setFilterAvailability('in-stock');
                      setIsAvailabilityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      filterAvailability === 'in-stock' ? 'font-medium' : ''
                    }`}
                  >
                    In Stock
                  </button>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPriceOpen(!isPriceOpen);
                  setIsAvailabilityOpen(false);
                  setIsSortOpen(false);
                }}
                className="flex items-center gap-2 text-sm"
              >
                Price
                <ChevronDown className="w-4 h-4" />
              </button>
              {isPriceOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-40 z-20">
                  <button
                    onClick={() => {
                      setPriceRange('all');
                      setIsPriceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      priceRange === 'all' ? 'font-medium' : ''
                    }`}
                  >
                    All Prices
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange('under10');
                      setIsPriceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      priceRange === 'under10' ? 'font-medium' : ''
                    }`}
                  >
                    Under $10
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange('10to50');
                      setIsPriceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      priceRange === '10to50' ? 'font-medium' : ''
                    }`}
                  >
                    $10 - $50
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange('over50');
                      setIsPriceOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      priceRange === 'over50' ? 'font-medium' : ''
                    }`}
                  >
                    Over $50
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Sort & Count */}
          <div className="flex items-center gap-6">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsAvailabilityOpen(false);
                  setIsPriceOpen(false);
                }}
                className="flex items-center gap-2 text-sm"
              >
                Recommended
                <ChevronDown className="w-4 h-4" />
              </button>
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md py-2 w-48 z-20">
                  {[
                    { value: 'recommended', label: 'Recommended' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'name-az', label: 'Name: A to Z' },
                    { value: 'name-za', label: 'Name: Z to A' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === option.value ? 'font-medium' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items count */}
            <span className="text-sm text-gray-500">
              {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <Link
                to={`/product/${product.slug}`}
                className="block relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  <img
                    src={
                      hoveredProduct === product.id && product.images[1]
                        ? product.images[1]
                        : product.images[0]
                    }
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
                <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    ${product.price.toFixed(2)} USD
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      <AuthModal />
    </div>
  );
};

export default CollectionPage;
