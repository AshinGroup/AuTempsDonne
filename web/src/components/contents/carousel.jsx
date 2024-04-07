import React, { useState, useEffect } from 'react';
import welcome1 from "../../resources/homePage1.jpg";
import welcome2 from "../../resources/atd_logo.png";
import welcome3 from "../../resources/atd_logo_.png";
import welcome4 from "../../resources/atd_logo_black.png";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const photos = [
      welcome1,
      welcome2,
      welcome3,
      welcome4,
    ];
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <div className="relative w-full h-64">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          />
        ))}
      </div>
    );
  };

  export default Carousel;