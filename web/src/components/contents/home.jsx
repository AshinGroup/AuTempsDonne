import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Footer from "../footer1";
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
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p><FormattedMessage id="home.paragraph1" defaultMessage="Bla Bla Bla" /></p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p><FormattedMessage id="home.paragraph2" defaultMessage="Bla Bla Bla" /></p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p><FormattedMessage id="home.paragraph3" defaultMessage="Bla Bla Bla" /></p>
              </div>
            </div>
            
            {/* <div className="bg-gray-200 flex justify-between pt-16 pb-16 pr-16 pl-16 mb-80">
              <div className="ml-24 mt-12">
                <h2 className="text-3xl font-bold mb-1 ml-48">Rejoignez nous, on compte sur vous !</h2>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-16 ml-96">M'inscrire</button>
              </div>
              <Carousel />
            </div> */}

            <div className="text-black text-center mt-24 mb-40">
              <h1 className="text-4xl font-bold mb-4"><FormattedMessage id="home.services" defaultMessage="Our Services" /></h1>
              <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
            </div>

            <div className="bg-gray-200 h-screen flex justify-between pr-16 pl-16 mb-40">
              <div className="w-1/3 flex items-center">
                <img src={maps} alt="Carte de nos locaux." className="ml-16 w-8/10 h-8/10" />
              </div>
              
              <div className="w-2/3 flex flex-col justify-between">
                <div className="ml-16">
                  <div className="bg-white mt-48 w-1/2 h-32 mb-16 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p><FormattedMessage id="home.paragraph4" defaultMessage="Bla Bla Bla" /></p></div>
                  <div className="bg-white w-1/2 h-32 mb-16 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p><FormattedMessage id="home.paragraph5" defaultMessage="Bla Bla Bla" /></p></div>
                  <div className="bg-white w-1/2 h-32 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p><FormattedMessage id="home.paragraph6" defaultMessage="Bla Bla Bla" /></p></div>
                </div>
              </div>
            </div>

            <div className="text-black text-center mt-24 mb-16">
              <h1 className="text-3xl font-bold mb-4"><FormattedMessage id="home.help" defaultMessage="Your Help is Essential ..." /></h1>
              <div className="w-64 h-0.5 bg-black mx-auto mb-8"></div>
            </div>

            <div className="text-center mb-40">
            <Link
              to={{
                pathname: "/",
                // search: "?sort=name",
                // hash: "#the-hash",
                state: { id: "donate" },
              }}>   
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"><FormattedMessage id="home.donate" defaultMessage="Make a Donation" /></button>
              </Link>
            </div>

            <div className="bg-gray-200 flex flex-col justify-center items-center pt-16 pb-16 pr-16 pl-16">
              <div className="mt-12 ml-8 text-center">
                <h2 className="text-3xl font-bold mb-8"><FormattedMessage id="home.joinUs" defaultMessage="Join us, we're counting on you!" /></h2>
                <Carousel />
                <div className="w-96 h-0.5 bg-black mt-8 mx-auto mb-8"></div>
                <Link to="/toujours-coucou">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"><FormattedMessage id="home.signUp" defaultMessage="Sign Up" /></button>
                </Link>
              </div>
            </div>
            <Footer />
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
