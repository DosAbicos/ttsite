import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/auth/AuthModal';
import RecommendedProducts from '../components/product/RecommendedProducts';
import ProductReviews from '../components/product/ProductReviews';
import SizeChart from '../components/product/SizeChart';
import PromoPopup from '../components/product/PromoPopup';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getBySlug(slug);
      const productData = response.data;
      setProduct(productData);
      setSelectedSize(productData.sizes?.[0] || '');
      setSelectedColor(productData.colors?.[0] || '');
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
            <button
              onClick={() => navigate('/collections')}
              className="text-sm underline hover:no-underline"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const discount = Math.round((1 - product.price / product.original_price) * 100);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-black">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => navigate('/collections')}
            className="hover:text-black"
          >
            Collections
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
              <img
                src={product.images?.[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-24 bg-gray-50 overflow-hidden border-2 transition-colors ${
                    currentImageIndex === idx
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold">
                ${product.price?.toFixed(2)} USD
              </span>
              <span className="text-lg text-gray-400 line-through">
                ${product.original_price?.toFixed(2)} USD
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                -{discount}%
              </span>
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Color: {selectedColor}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center border border-gray-200 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-8 font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-4 border border-black font-medium hover:bg-gray-50 transition-colors"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Product info */}
            <div className="mt-8 pt-8 border-t space-y-4 text-sm text-gray-600">
              <p>• Free shipping over $39</p>
              <p>• 45-day free returns and exchanges</p>
              <p>• Secure payment</p>
            </div>
          </div>
        </div>

        {/* Customer Reviews - above recommendations */}
        <ProductReviews productSlug={slug} />
        
        {/* Recommended Products */}
        <RecommendedProducts currentProductId={product?.id} />
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
};

export default ProductPage;
