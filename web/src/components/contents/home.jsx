import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import welcome from "../../resources/homePage1.jpg";
import maps from "../../resources/maps.png";
import carousel1 from "../../resources/carousel1.jpg";
import carousel2 from "../../resources/carousel2.jpg";
import carousel3 from "../../resources/carousel3.jpg";
import carousel4 from "../../resources/carousel4.jpg";
import { FormattedMessage } from 'react-intl';

const HomePage = () => {
  return (
    <>
      <div
        className="bg-cover bg-center h-screen flex justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${welcome})`,
          backgroundPosition: "center top 40%",
        }}
      >
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4"><FormattedMessage id="home.principalTitle" defaultMessage="We Need You" /></h1>
          <div className="w-80 h-0.5 bg-white mx-auto mb-8"></div>
        </div>
      </div>

      <div className="text-black text-center mt-24 mb-40">
        <h1 className="text-4xl font-bold mb-4"><FormattedMessage id="home.missions" defaultMessage="Our Missions" /></h1>
        <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
      </div>

      <div className="flex mb-64">
        <div className="bg-gray-200 w-1/3 h-72 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
          <p className="text-center text-lg font-medium"><FormattedMessage id="home.paragraph1" defaultMessage="Inform and raise awareness in society about social and environmental issues through dedicated campaigns and events." /></p>
        </div>
        <div className="bg-gray-200 w-1/3 h-72 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
          <p className="text-center text-lg font-medium"><FormattedMessage id="home.paragraph2" defaultMessage="Provide concrete help to people in need by offering them meals and social support." /></p>
        </div>
        <div className="bg-gray-200 w-1/3 h-72 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
          <p className="text-center text-lg font-medium"><FormattedMessage id="home.paragraph3" defaultMessage="Work to strengthen social ties by organizing activities and programs aimed at improving the quality of life within society." /></p>
        </div>
      </div>

      <div className="text-black text-center mt-24 mb-40">
        <h1 className="text-4xl font-bold mb-4"><FormattedMessage id="home.services" defaultMessage="Our Services" /></h1>
        <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
      </div>

      <div className="bg-gray-200 h-2/3 flex flex-col lg:flex-row justify-between pr-8 lg:pr-16 pl-8 lg:pl-16 mb-40 pb-24">
        <div className="hidden lg:block w-full lg:w-1/3 flex items-center justify-center lg:mt-32">
          <img src={maps} alt="Carte de nos locaux." className="w-10/12 lg:w-8/10 h-auto max-h-full" />
        </div>

        <div className="w-full lg:w-2/3 flex flex-col justify-between">
          <div className="ml-0 lg:ml-16 lg:mt-32">
            <div className="bg-white mt-8 lg:mt-16 lg:ml-8 xl:ml-96 shadow-md rounded-xl flex flex-col justify-center items-center p-4 lg:p-8">
              <p className="text-base lg:text-lg xl:text-xl"><FormattedMessage id="home.paragraph4" defaultMessage="Gathering together to accumulate food" /></p>
            </div>
            <div className="bg-white mt-8 lg:mt-8 lg:ml-8 xl:ml-96 shadow-md rounded-xl flex flex-col justify-center items-center p-4 lg:p-8">
              <p className="text-base lg:text-lg xl:text-xl"><FormattedMessage id="home.paragraph5" defaultMessage="Maraudes aimed at distributing food" /></p>
            </div>
            <div className="bg-white mt-8 lg:mt-8 lg:ml-8 xl:ml-96 shadow-md rounded-xl flex flex-col justify-center items-center p-4 lg:p-8">
              <p className="text-base lg:text-lg xl:text-xl"><FormattedMessage id="home.paragraph6" defaultMessage="Collecting donations from individuals" /></p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center flex-col md:flex-row items-center mb-24">
        <div class="text-black text-center mt-24 mb-16 md:mr-72 md:mb-0">
          <h1 class="text-3xl font-bold mb-4">Your Help is Essential ...</h1>
          <div class="w-64 h-0.5 bg-black mx-auto mb-8"></div>
          <a href="/donate">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Make a Donation</button>
          </a>
        </div>

        <div class="text-center ml-0 md:ml-72">
          <h2 class="text-3xl font-bold mb-8">Join us, we're counting on you!</h2>
          <Carousel />
          <Link to="/signup">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-8">Sign Up</button>
          </Link>
        </div>
      </div>

    </>
  );
};

export default HomePage;

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
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] h-64 max-h-[400px] mr-24 rounded-xl overflow-hidden">
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
