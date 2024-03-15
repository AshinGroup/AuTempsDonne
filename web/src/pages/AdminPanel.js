import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Users from "../components/contents/users";
import Courses from "../components/contents/courses";

const AdminPanel = () => {
  const [activeItem, setActiveItem] = useState("Courses");
  const navigate = useNavigate();

  const getContent = () => {
    switch (activeItem) {
      case "Users":
        return <Users />;
      case "Activities":
        return <div>Activities content here</div>;
      case "Courses":
        return <Courses />;
      case "Profile":
        navigate("/profile");
      case "Logout":
        navigate("/logout");
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
