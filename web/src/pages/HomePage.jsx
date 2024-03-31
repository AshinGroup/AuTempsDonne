import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import HomePage from "../components/contents/home";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";

const WelcomePage = () => {
  const [activeItem, setActiveItem] = useState("support");
  const navigate = useNavigate();
  const rule = "bénévole";

  const getContent = () => {
    switch (activeItem) {
      case "homepage":
        return <HomePage />;
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
      case "login":
        navigate("/login");
        return;
      case "signin":
        navigate("/signin");
        return;
      case "profile":
        navigate("/profile");
        return;
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
