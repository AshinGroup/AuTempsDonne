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

const App = () => {
  const { locale } = useLanguage();
  const messages = translations[locale];

  useEffect(() => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      sessionStorage.setItem("refresh_token", refreshToken);
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
    console.log("role : ", sessionStorage.getItem("role"));
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Routes>
        {/* à voir mais, ptet ajouter les routes pour tout les contents de la navbar, pour pouvoir y accéderr */}
        {/* <Route path="/" element={<LogIn />} /> */}
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
