import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/navbar";
import HomePage from "../components/contents/home";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";
import Profile from "../components/contents/profile";

const WelcomePage = () => {
  // Profile Management from Dashboard (ugly code, to be refactored)
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.state?.id || "homepage"
  );

  const navigate = useNavigate();
  // const rule = "commerce" || "bénévole" || "admin" || "béneficiaire";
  const rule = "admin";

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
