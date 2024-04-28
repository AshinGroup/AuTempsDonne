import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Users from "../components/contents/users";
import Events from "../components/contents/events";
import Stock from "../components/contents/stock";
import ToCollect from "../components/contents/toCollect";
import Shops from "../components/contents/shops";

const ErrorPage = () => {
  return (
    <div className="flex justify-content items-center">
      <h2>ERROR PAGE</h2>
    </div>
  );
};

export default ErrorPage;
