import React, { useState } from "react";
import Error_404 from "../../resources/404.png";

const Error = () => {
  return (
    <div className="w-screen">
      <div className="flex items-center flex-col justify-center h-screen">
        <img src={Error_404} className="w-1/2" alt="ERROR_404" />
        <h2 className="font-semibold text-xl">We are sorry, the page you are looking for do not exist.</h2>
        <h2 className="font-semibold text-lg text-gray-500">Please contact support for any anormal activity.</h2>
      </div>
      
    </div>
  );
};

export default Error;
