import React from "react";
import { Routes, Route } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { useLanguage } from "./translations/languageContext";
import translations from "./translations/translations";

import WelcomePage from "./pages/WelcomePage";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import LogOut from "./pages/LogOut";

const App = () => {
  const { locale } = useLanguage();
  const messages = translations[locale];

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
