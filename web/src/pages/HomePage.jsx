import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import Navbar from "../components/navbar";
import HomePage from "../components/contents/home";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";
import Profile from "../components/contents/profile";
import Carousel from "../components/contents/carousel";
// import "./HomePage.css";
import welcome from "../resources/homePage1.jpg";
import maps from "../resources/maps.png";

const WelcomePage = () => {
  // Profile Management from Dashboard (ugly code, to be refactored)
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.state?.id || "homepage"
  );

  const navigate = useNavigate();
  const rule = "admin";

  const getContent = () => {
    switch (activeItem) {
      case "homepage":
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
                <h1 className="text-4xl font-bold mb-4">Nous avons besoin de vous</h1>
                <div className="w-80 h-0.5 bg-white mx-auto mb-8"></div>
              </div>
            </div>

            <div className="text-black text-center mt-24 mb-40">
              <h1 className="text-4xl font-bold mb-4">Nos missions</h1>
              <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
            </div>

            <div className="flex mb-64">
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-xl mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
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
              <h1 className="text-4xl font-bold mb-4">Nos services</h1>
              <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
            </div>

            <div className="bg-gray-200 h-screen flex justify-between pr-16 pl-16 mb-40">
              <div className="w-1/3 flex items-center">
                <img src={maps} alt="Carte de nos locaux." className="ml-16 w-8/10 h-8/10" />
              </div>
              
              <div className="w-2/3 flex flex-col justify-between">
                <div className="ml-16">
                  <div className="bg-white mt-48 w-1/2 h-32 mb-16 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p>Bla Bla Bla</p></div>
                  <div className="bg-white w-1/2 h-32 mb-16 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p>Bla Bla Bla</p></div>
                  <div className="bg-white w-1/2 h-32 ml-96 shadow-md rounded-xl flex flex-col justify-center items-center"><p>Bla Bla Bla</p></div>
                </div>
              </div>
            </div>

            <div className="text-black text-center mt-24 mb-16">
              <h1 className="text-3xl font-bold mb-4">Votre aide est primordiale ...</h1>
              <div className="w-64 h-0.5 bg-black mx-auto mb-8"></div>
            </div>

            <div className="text-center mb-40">
              <Link to="/coucou">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Faire un don</button>
              </Link>
            </div>

            <div className="bg-gray-200 flex flex-col justify-center items-center pt-16 pb-16 pr-16 pl-16 mb-80">
              <div className="mt-12 ml-8 text-center">
                <h2 className="text-3xl font-bold mb-8">Rejoignez nous, on compte sur vous !</h2>
                <Carousel />
                <div className="w-96 h-0.5 bg-black mt-8 mx-auto mb-8"></div>
                <Link to="/toujours-coucou">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">M'inscrire</button>
                </Link>
              </div>
            </div>

          </>
        );
                
      case "services":
        return <div>Services</div>;
      case "activities":
        return <div>Activities</div>;
      case "courses":
        return <div>Courses</div>;
      case "tocollect":
        return <div>To Collect</div>;
      case "planning":
        return <div>Planning</div>;
      case "support":
        return <Support />;
      case "donate":
        return <Donation />;
      case "adminpanel":
        navigate("/admin-panel");
        return;
      case "login":
        navigate("/login");
        return;
      case "signin":
        navigate("/signin");
        return;
      case "profile":
        return <Profile />;
      case "logout":
        navigate("/logout");
        return;
      default:
        return <div>Select an item</div>;
    }
  };

  return (
    <div className="flex flex-col">
      <Navbar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        Rule={rule}
      />
      <main className="flex-1">{getContent()}</main>
    </div>
  );
};
export default WelcomePage;
