import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import Navbar from "../components/navbar";
import Home from "../components/contents/home";
import Services from "../components/contents/services";
import Activities from "../components/contents/activities";
import Courses from "../components/contents/courses";
import Planning from "../components/contents/planning";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";
import Profile from "../components/contents/profile";
import DemandToCollect from "../components/contents/demandToCollect";

const WelcomePage = ({direct}) => {
  // Profile Management from Dashboard (ugly code, to be refactored)
  const [activeItem, setActiveItem] = useState(
    direct || "homepage"
  );
  const navigate = useNavigate();
  // const rule = 1: Admin, 2: Volontaire, 3: Bénéficiaire, 4: Commerçant
  const rule = sessionStorage.getItem("rule");
  // const rule = "1";

  useEffect(() => {
    if (activeItem){
      navigate(`/${activeItem}`)
    }
  }, [activeItem]);

  const getContent = () => {
    switch (activeItem) {
      case "homepage":
        return <Home />;
      case "services":
        return <Services />;
      case "activities":
        return <Activities />;
      case "courses":
        return <Courses />;
      case "demandToCollect":
        return <DemandToCollect />;
      case "planning":
        return <Planning />;
      case "support":
        return <Support />;
      case "donate":
        return <Donation />;
      case "admin-panel":
        navigate("/admin-panel");
        return;
      case "login":
        navigate("/login");
        return;
      case "signup":
        navigate("/signup");
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
