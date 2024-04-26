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

{
  /* -------------------------------------------------------- */
}
const LOOG = () => {
  fetch(`http://127.0.0.1:5000/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "h@h.com",
      password: "aaaAAA111!",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      sessionStorage.setItem("access_token", data?.access_token);
      sessionStorage.setItem("refresh_token", data?.refresh_token);
      console.log(data?.refresh_token);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};
{
  /* -------------------------------------------------------- */
}

const App = () => {
  const { locale } = useLanguage();
  const messages = translations[locale];

  // {
  //   /* -------------------------------------------------------- */
  // }
  // LOOG();
  // const tokenString = sessionStorage.getItem("access_token");
  // // console.log(tokenString)
  // // const userToken = JSON.parse(tokenString);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   fetch(`http://127.0.0.1:5000/api/protected`, {
  //     headers: {
  //       Authorization: `Bearer ${tokenString}`,
  //       // 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMzU3MDM0MywianRpIjoiOTVhMzk2ZGItZDcxMi00ZDkzLTgwMzAtNjc3M2RhMWViNmEwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MTEsIm5iZiI6MTcxMzU3MDM0MywiY3NyZiI6ImY3NGI4N2I4LWI0YzYtNDdkMS1hY2M1LWE3MjM4ZjQ5MmVhOCIsImV4cCI6MTcxMzU3Mzk0M30.TNvvmWQzWiVV3mATs8tSL4xu8uR3irwQh6J1FFWQ9_Y`
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         if (response.status === 401) {
  //           // Si ça, regenerate Token, et si ça renvoi aussi une erreur c'est que le refresh token est expiré, en renvoi vers la page d'accueil avec une popup de déco
  //           navigate("/", { token: true });
  //         }
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching users:", error);
  //     });
  // }, []);

  // {
  //   /* -------------------------------------------------------- */
  // }

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
