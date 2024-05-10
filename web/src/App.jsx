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
  const url = window.location.pathname;

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

    // get the browser url path
    // console.log("url:",url);
    if(url != "/") {
      handleRoute(url, navigate);
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
        {/* HomePage Routes and their direct props */}
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/services" element={<HomePage direct="services"/>} />
        <Route path="/activities" element={<HomePage direct="activities"/>} />
        <Route path="/courses" element={<HomePage direct="courses"/>} />
        <Route path="/demandToCollect" element={<HomePage direct="demandToCollect"/>} />
        <Route path="/planning" element={<HomePage direct="planning"/>} />
        <Route path="/support" element={<HomePage direct="support"/>} />
        <Route path="/donate" element={<HomePage direct="donate"/>} />
        <Route path="/profile" element={<HomePage direct="profile"/>} />
        {/* AdminPanel Routes and their direct props */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin-panel/users" element={<AdminPanel direct="users"/>} />
        <Route path="/admin-panel/events" element={<AdminPanel direct="events"/>} />
        <Route path="/admin-panel/stock" element={<AdminPanel direct="stock"/>} />
        <Route path="/admin-panel/shops" element={<AdminPanel direct="shops"/>} />
        <Route path="/admin-panel/collects" element={<AdminPanel direct="collects"/>} />
        <Route path="/admin-panel/demands" element={<AdminPanel direct="demands"/>} />
        <Route path="/admin-panel/deliveries" element={<AdminPanel direct="deliveries"/>} />
        {/* Auth Routes */}
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

function handleRoute(url, navigate) {
  switch (url) {
    case "/admin-panel":
      navigate("/admin-panel");
      break;
    case "/admin-panel/deliveries":
      navigate("/admin-panel/deliveries");
      break;
    case "/support":
      navigate("/support");
      break;
    case "/signup":
      navigate("/signup");
      break;
    case "/login":
      navigate("/login");
      break;
    case "/logout":
      navigate("/logout");
      break;
    default:
      // navigate("/");
      break;
  }
}