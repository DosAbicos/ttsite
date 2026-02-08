import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../../data/mock';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicate slides for infinite scroll effect
  const extendedSlides = [...heroSlides, ...heroSlides, ...heroSlides];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-center px-1"
          >
            <Link to={slide.link} className="block relative group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable="false"
                />
              </div>
              <div className="absolute bottom-8 left-8">
                <span className="inline-block bg-white px-4 py-2 text-sm font-medium tracking-wider hover:bg-black hover:text-white transition-colors">
                  SHOP COLLECTION &gt;
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
