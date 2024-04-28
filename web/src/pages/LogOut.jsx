import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  }, []);

  return <></>;
};

export default LogOut;
