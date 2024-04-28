import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import Navbar from "../components/navbar";
import Home from "../components/contents/home";
import Donation from "../components/contents/donation";
import Support from "../components/contents/support";
import Profile from "../components/contents/profile";

import handleFetch from "../components/handleFetch";

const WelcomePage = () => {
  // Profile Management from Dashboard (ugly code, to be refactored)
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(
    location.hash.substring(1) ? location.hash.substring(1) : "homepage"
  );

  console.log(activeItem);
  const navigate = useNavigate();

  useEffect(() => {
    const rule = sessionStorage.getItem("rule");

    if (rule === null) {
      handleFetch(`http://127.0.0.1:5000/api/protected`)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.message);
            });
          }
          return response.json();
        })
        .then((data) => {
          sessionStorage.setItem("rule", data?.role);
          sessionStorage.setItem("user_id", data?.user_id);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          navigate("/");
        });
    }
  }, []);
  // const rule = "commerce" || "bénévole" || "admin" || "béneficiaire";
  // check ici la conversion entre int et string
  const rule = sessionStorage.getItem("rule") || "";

  const getContent = () => {
    switch (activeItem) {
      case "homepage":
        return <Home />;
      case "services":
        return <div>Services</div>;
      case "activities":
        return <div>Activities</div>;
      case "courses":
        return <div>Courses</div>;
      case "tocollect":
        return <div>To Collect</div>;
      case "genqr":
        return <div>Generate QR Code</div>;
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
