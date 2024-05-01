import React from 'react';
import logo from '../resources/atd_logo_typo.png';
import { useLanguage } from "../translations/languageContext";
import { FormattedMessage } from "react-intl";
import Flag from "react-flagkit";

const Footer = () => {
  const { locale, changeLocale } = useLanguage();
  const isChinese = locale === 'cn';

  const LanguageButton = ({ country }) => {
    const isActive = (currentLocale) => currentLocale === locale;

    return (
      <button
        className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-2 m-1 focus:outline-none transition ease-in-out duration-300 ${isActive(country) ? "from-AshinBlue-light to-AshinBlue-dark" : ""
          }`}
        onClick={() => changeLocale(country == "gb" ? "en" : country)}
      >
        <Flag country={country.toUpperCase()} />
      </button>
    );
  };

  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <div className="ml-4 mr-80">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        <div className={`${isChinese ? 'pl-56' : 'pl-40'} ${isChinese ? 'mr-80' : 'mr-72'}`}>
          <p>© 2024 - Au Temps Donné. <FormattedMessage id="footer.credits" defaultMessage="All rights reserved." /></p>
        </div>

        <div className="ml-auto mr-4">
          <LanguageButton country="gb" />
          <LanguageButton country="fr" />
          <LanguageButton country="es" />
          <LanguageButton country="cn" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
