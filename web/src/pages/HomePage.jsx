import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/navbar";
import HomePage from "../components/contents/home";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";
import Profile from "../components/contents/profile";
import Carousel from "../components/contents/carousel";
// import "./HomePage.css";
import welcome from "../resources/homePage1.jpg";

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
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-lg mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-lg mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
              </div>
              <div className="bg-gray-200 w-1/3 h-96 p-4 flex flex-col justify-center items-center rounded-lg mr-8 ml-8 shadow-md">
                <p>Bla Bla Bla</p>
              </div>
            </div>
            <Carousel />














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
