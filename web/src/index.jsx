import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./translations/languageContext";
import "./index.css";
import App from "./App";


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <LanguageProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LanguageProvider>
);
