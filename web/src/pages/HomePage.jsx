import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import Home from "../components/contents/home";

const WelcomePage = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();
  const rule = "bénévole";

  const getContent = () => {
    switch (activeItem) {
      case "Home":
        return <Home />;
      case "Profile":
        navigate("/profile");
      case "Logout":
        navigate("/logout");
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
