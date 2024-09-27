import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [draggingPosition, setDraggingPosition] = useState(0);
  const sliderRef = useRef(null);

  const handleDragStart = (position) => {
    setIsDragging(true);
    setStartPosition(position);
  };

  const handleDragMove = (position) => {
    if (isDragging) {
      setDraggingPosition(position - startPosition);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    // Slide when dragged enough
    if (draggingPosition > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (draggingPosition < -100) {
      if (currentIndex < slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Transition to the first slide after the last slide
      }
    }
    setDraggingPosition(0); // Reset
  };

  useEffect(() => {
    const interval = setInterval(() => {
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
          transform: `translateX(${-currentIndex * 100}%)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
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
          <div key={index} className="flex-shrink-0 w-full">
            {slide}
          </div>
        ))}
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 transform -translate-x-1/2 flex flex-col gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-sky-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
