import React, { useState, useEffect } from 'react';
import carousel1 from "../../resources/carousel1.jpg";
import carousel2 from "../../resources/carousel2.jpg";
import carousel3 from "../../resources/carousel3.jpg";
import carousel4 from "../../resources/carousel4.jpg";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const pictures = [
        carousel1,
        carousel2,
        carousel3,
        carousel4,
    ];
  
    useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex === pictures.length - 1 ? 0 : prevIndex + 1));
        }, 6000);
    
        return () => clearInterval(intervalId);
      }, []);
    
      return (
          <div className="relative w-full max-w-[600px] h-64 max-h-[400px] mr-24">
            {pictures.map((picture, index) => (
              <img
                key={index}
                src={picture}
                alt={`Photo ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
              />
            ))}
          </div>
      );
    };

  export default Carousel;