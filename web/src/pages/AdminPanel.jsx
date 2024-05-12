import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Users from "../components/contents/users";
import Events from "../components/contents/events";
import Stock from "../components/contents/stock";

import Collects from "../components/contents/collects";
import Shops from "../components/contents/shops";
import Demands from "../components/contents/demands";
import Deliveries from "../components/contents/deliveries";

const AdminPanel = ({ direct }) => {
  const [activeItem, setActiveItem] = useState(direct || "users");
  const navigate = useNavigate();

  useEffect(() => {
    if (activeItem) {
      navigate(`/admin-panel/${activeItem}`);
    }
  }, [activeItem]);

  const getContent = () => {
    switch (activeItem) {
      case "users":
        return <Users />;
      case "events":
        return <Events />;
      case "stock":
        return <Stock />;
      case "shops":
        return <Shops />;
      case "collects":
        return <Collects />;
      case "demands":
        return <Demands />;
      case "deliveries":
        return <Deliveries />;
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
    <div className="flex">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1">{getContent()}</main>
    </div>
  );
};

export default AdminPanel;
