import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Users from "../components/contents/users";
import Events from "../components/contents/events";
import Stock from "../components/contents/stock";
import ToCollect from "../components/contents/toCollect";
import Shops from "../components/contents/shops";

const AdminPanel = () => {
  const [activeItem, setActiveItem] = useState("ToCollect");
  const navigate = useNavigate();

  const getContent = () => {
    switch (activeItem) {
      case "Users":
        return <Users />;
      case "Events":
        return <Events />;
      case "Stock":
        return <Stock />;
      case "Shops":
        return <Shops />;
      case "ToCollect":
        return <ToCollect />;
      case "Profile":
        navigate("/", { state: { id: "profile" } });
        return;
      case "Logout":
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
