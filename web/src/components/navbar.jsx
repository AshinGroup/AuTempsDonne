import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../translations/languageContext";
import { FormattedMessage, useIntl } from "react-intl";
import Flag from "react-flagkit";
import {
  User2,
  Globe,
  LogOut,
  UserRoundSearch,
  UserRoundPlus,
  Fish,
  User,
  MenuIcon,
} from "lucide-react";
import atd_logo_ from "../resources/atd_logo_.png";
import atd_logo_typo from "../resources/atd_logo_typo.png";

export default function Navbar({ activeItem, setActiveItem, Rule }) {
  const [expanded, setExpanded] = useState(() => window.innerWidth > 1100);

  const [isBurgerOpen, setBurgerOpen] = useState(false);

  const toggleBurgerOpen = () => {
    setBurgerOpen(!isBurgerOpen);
  };

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  // Render links based on user role
  const renderLinks = () => {
    switch (Rule) {
      case "commerce":
        return (
          <>
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.homepage"
                  defaultMessage="HomePage"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.tocollect"
                  defaultMessage="tocollect"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
            />
            <NavbarButton rule={Rule} expanded={expanded} />
          </>
        );
      case "bénéficiaire":
        return (
          <>
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.services"
                  defaultMessage="services"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.activities"
                  defaultMessage="activities"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.planning"
                  defaultMessage="planning"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
            />
            <NavbarButton rule={Rule} expanded={expanded} />
          </>
        );
      case "bénévole":
        return (
          <>
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.activities"
                  defaultMessage="activities"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.services"
                  defaultMessage="services"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.courses"
                  defaultMessage="courses"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.planning"
                  defaultMessage="planning"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
            />
            <NavbarButton rule={Rule} expanded={expanded} />
          </>
        );
      default:
        return (
          <>
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.homepage"
                  defaultMessage="HomePage"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
            />
            <NavbarButton rule={Rule} expanded={expanded} />
          </>
        );
    }
  };

  return (
    // If the screen is expanded
    <>
      <nav className={`flex flex-col bg-white border-r shadow-sm`}>
        <div
          className={`flex w-screen bg-white border-r shadow-sm ${
            !expanded ? "justify-between" : ""
          }`}
        >
          <div className="p-4 pb-3 relative flex justify-between items-center">
            <Link to="/">
              <img
                src={atd_logo_typo}
                alt="ATD Logo Typo"
                className="max-w-64"
              />
            </Link>
          </div>
          {expanded && (
            <ul className="flex justify-around items-center w-full">
              {renderLinks()}
            </ul>
          )}
          {!expanded && (
            <button
              onClick={toggleBurgerOpen}
              className="p-1 me-10 text-gray-500 hover:text-AshinBlue transition-colors duration-150 ease-in-out"
            >
              <MenuIcon size={25} />
            </button>
          )}
        </div>
        {!expanded && isBurgerOpen && (
          <ul className="w-full">{renderLinks()}</ul>
        )}
      </nav>
    </>
  );
}

function NavbarItem({ path, text }) {
  return (
    <li className=" px-2 py-4 m-2 text-center border-b-2 border-gray-200 hover:border-AshinBlue-light ">
      <Link
        to={path}
        className="items-center font-semibold border-0 rounded py-2 px-3"
      >
        {text}
      </Link>
    </li>
  );
}

function NavbarButton(rule, expanded) {
  const [LanOpen, setLanOpen] = useState(false);
  const [UserOpen, setUserOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(window.innerWidth > 980);
  const { locale, changeLocale } = useLanguage();

  useEffect(() => {
    const handleResize = () => {
      setNavExpanded(window.innerWidth > 980);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  console.log(navExpanded == true);
  const toggleLanOpen = () => {
    setLanOpen(!LanOpen);
    setUserOpen(false);
  };
  const toggleUserOpen = () => {
    setUserOpen(!UserOpen);
    setLanOpen(false);
  };

  const intl = useIntl();

  const login = intl.formatMessage({
    id: "navbar.login",
    defaultMessage: "login",
  });
  const logout = intl.formatMessage({
    id: "navbar.logout",
    defaultMessage: "logout",
  });
  const profile = intl.formatMessage({
    id: "navbar.profile",
    defaultMessage: "profile",
  });
  const signin = intl.formatMessage({
    id: "navbar.signin",
    defaultMessage: "signin",
  });

  const links = [
    {
      to: rule ? "/connexion" : "/profile",
      label: rule ? login : profile,
      icon: rule ? (
        <Fish size={20} className="me-1" />
      ) : (
        <UserRoundSearch size={20} className="me-1" />
      ),
    },
    {
      to: rule ? "/inscription" : "/deconnexion",
      label: rule ? signin : logout,
      icon: rule ? (
        <UserRoundPlus size={20} className="me-1" />
      ) : (
        <LogOut size={20} className="me-1" />
      ),
    },
  ];

  if (navExpanded) {
    return (
      <li className={`flex justify-around ${expanded ? "me-10" : ""}`}>
        {/* DROPDOWN USER */}
        <div>
          <button onClick={toggleUserOpen} className="mt-2 me-3">
            <User2 size={22} />
          </button>
          {UserOpen && (
            <ul className="absolute flex flex-col bg-white px-2 shadow-lg pb-2 pt-4 border-0 rounded font-semibold">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="flex px-2 my-1 py-1 border-b-2 border-white hover:border-AshinBlue"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </ul>
          )}
        </div>
        {/* DROPDOWN USER */}
        {/* DROPDOWN INTERNATIONAL */}
        <div>
          <button onClick={toggleLanOpen} className="mt-2 ms-3">
            <Globe size={22} />
          </button>
          {LanOpen && (
            <ul className="absolute flex flex-col bg-white px-2 shadow-lg py-4 border-0 rounded">
              {/* Dropdown items */}
              <LanguageButton
                locale={locale}
                changeLocale={changeLocale}
                country="gb"
              />
              <LanguageButton
                locale={locale}
                changeLocale={changeLocale}
                country="fr"
              />
              <LanguageButton
                locale={locale}
                changeLocale={changeLocale}
                country="es"
              />
              <LanguageButton
                locale={locale}
                changeLocale={changeLocale}
                country="cn"
              />
            </ul>
          )}
        </div>
        {/* DROPDOWN INTERNATIONAL */}
      </li>
    );
  } else {
    return (
      <>
        {links.map((link, _) => (
          <NavbarItem path={link.to} text={link.label} />
        ))}
      </>
    );
  }
}

function LanguageButton({ locale, changeLocale, country }) {
  const isActive = (currentLocale) => currentLocale === locale;

  return (
    <button
      className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-2 m-1 focus:outline-none transition ease-in-out duration-300 ${
        isActive(country) ? "from-AshinBlue-light to-AshinBlue-dark" : ""
      }`}
      onClick={() => changeLocale(country === "gb" ? "en" : country)}
    >
      <Flag country={country.toUpperCase()} />
    </button>
  );
}
