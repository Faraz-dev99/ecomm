import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [draggingPosition, setDraggingPosition] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true); // Control transition
  const sliderRef = useRef(null);

  const handleDragStart = (position) => {
    setIsDragging(true);
    setStartPosition(position);
    setTransitionEnabled(false); // Disable transition while dragging
  };

  const handleDragMove = (position) => {
    if (isDragging) {
      setDraggingPosition(position - startPosition); // Track drag distance
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTransitionEnabled(true); // Enable transition for smooth effect

    // Slide when dragged enough
    if (draggingPosition > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (draggingPosition < -100) {
      if (currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // If it's the last slide, reset to the first
        setCurrentIndex(0);
      }
    }
    setDraggingPosition(0); // Reset drag position after slide change
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitionEnabled(true); // Enable transition for auto slide
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative overflow-hidden w-full" ref={sliderRef}>
      <div
        className="flex transition-transform ease-out duration-500"
        style={{
          // Apply dragging offset while dragging
          transform: `translateX(calc(${-currentIndex * 100}% + ${draggingPosition}px))`,
          transition: transitionEnabled ? 'transform 0.5s ease' : 'none', // Apply transition only when needed
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-full bg-gradient-to-br from-slate-800 via-slate-950 to-teal-600">
            {slide}
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 -tranzinc-y-1/2 right-2 transform -tranzinc-x-1/2 flex flex-col gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-teal-600' : 'bg-zinc-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
