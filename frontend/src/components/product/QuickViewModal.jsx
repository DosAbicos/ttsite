import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // Handle both camelCase and snake_case price fields
  const price = product?.price || 0;
  const originalPrice = product?.originalPrice || product?.original_price || 0;
  const images = product?.images || [];
  const sizes = product?.sizes || [];
  const colors = product?.colors || [];

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-auto bg-white z-50 rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:opacity-70 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Images */}
          <div className="p-6">
            <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden">
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-16 h-20 bg-gray-50 overflow-hidden border-2 transition-colors ${
                      currentImage === idx ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold">
                ${price.toFixed(2)} USD
              </span>
              {originalPrice > 0 && (
                <span className="text-gray-400 line-through">
                  ${originalPrice.toFixed(2)} USD
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-6">{product.description}</p>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm transition-colors ${
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
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color: {selectedColor}</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm transition-colors ${
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
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center border border-gray-200 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors mt-auto"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;
