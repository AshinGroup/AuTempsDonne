import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import LogOut from "./pages/LogOut";

const App = () => {
  return (
    <div>
      <Routes>
        {/* // <Route path="/" element={<WelcomePage />} /> */}
        <Route path="/" element={<AdminPanel />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
