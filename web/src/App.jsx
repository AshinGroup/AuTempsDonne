import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { useLanguage } from "./translations/languageContext";
import translations from "./translations/translations";

import HomePage from "./pages/HomePage";
import AdminPanel from "./pages/AdminPanel";
import LogOut from "./pages/LogOut";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ErrorPage from "./pages/ErrorPage";

import handleFetch from "./components/handleFetch";
import path from "path-browserify";

const App = () => {
  const { locale } = useLanguage();
  const messages = translations[locale];
  const navigate = useNavigate();

  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      sessionStorage.setItem("refresh_token", refreshToken);
      const env_path = process.env.REACT_APP_API_PATH
      handleFetch(`${env_path}/protected`)
        .then((response) => {
          if (!response) {
            throw new Error(response.message);
          }
          return response;
        })
        .then((data) => {
          sessionStorage.setItem("rule", data?.role_id);
          sessionStorage.setItem("user_id", data?.user_id);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          navigate("/");
        });
    }
    console.log(
      "localStorage refresh token : ",
      localStorage.getItem("refresh_token")
    );
    console.log(
      "localStorage access token : ",
      localStorage.getItem("access_token")
    );
    console.log(
      "sessionStorage refresh token : ",
      sessionStorage.getItem("refresh_token")
    );
    console.log(
      "sessionStorage access token : ",
      sessionStorage.getItem("access_token")
    );
    console.log("user Id : ", sessionStorage.getItem("user_id"));
    console.log("role : ", sessionStorage.getItem("rule"));
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Routes>
        {/* à voir mais, ptet ajouter les routes pour tout les contents de la navbar, pour pouvoir y accéderr */}
        {/* <Route path="/" element={<AdminPanel />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
