import React from "react";
import { Link } from "react-router-dom";

const LogOut = () => {
  return (
    <div className="bg-blue-100 h-screen flex justify-center items-center">
      <div>
        Welcome to LogOut! Go to the{" "}
        <Link to="/admin-panel" className="text-blue-600 hover:text-blue-800">
          Administration Page
        </Link>
        .
      </div>
    </div>
  );
};

export default LogOut;
