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
      case "4": // Commerçant
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
              isActive={activeItem === "homepage"}
              onClick={() => setActiveItem("homepage")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.demandToCollect"
                  defaultMessage="Demand to Collect"
                />
              }
              isActive={activeItem === "demandToCollect"}
              onClick={() => setActiveItem("demandToCollect")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
              isActive={activeItem === "support"}
              onClick={() => setActiveItem("support")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
              isActive={activeItem === "donate"}
              onClick={() => setActiveItem("donate")}
            />
            <NavbarButton
              Rule={Rule}
              activeItem={activeItem}
              expanded={expanded}
              setActiveItem={setActiveItem}
            />
          </>
        );
      case "3": // Bénéficiaire
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
              isActive={activeItem === "services"}
              onClick={() => setActiveItem("services")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.activities"
                  defaultMessage="activities"
                />
              }
              isActive={activeItem === "activities"}
              onClick={() => setActiveItem("activities")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.planning"
                  defaultMessage="planning"
                />
              }
              isActive={activeItem === "planning"}
              onClick={() => setActiveItem("planning")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
              isActive={activeItem === "support"}
              onClick={() => setActiveItem("support")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
              isActive={activeItem === "donate"}
              onClick={() => setActiveItem("donate")}
            />
            <NavbarButton
              Rule={Rule}
              activeItem={activeItem}
              expanded={expanded}
              setActiveItem={setActiveItem}
            />
          </>
        );
      case "2": // Bénévole
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
              isActive={activeItem === "activities"}
              onClick={() => setActiveItem("activities")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.services"
                  defaultMessage="services"
                />
              }
              isActive={activeItem === "services"}
              onClick={() => setActiveItem("services")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.courses"
                  defaultMessage="courses"
                />
              }
              isActive={activeItem === "courses"}
              onClick={() => setActiveItem("courses")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.planning"
                  defaultMessage="planning"
                />
              }
              isActive={activeItem === "planning"}
              onClick={() => setActiveItem("planning")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
              isActive={activeItem === "support"}
              onClick={() => setActiveItem("support")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
              isActive={activeItem === "donate"}
              onClick={() => setActiveItem("donate")}
            />
            <NavbarButton
              Rule={Rule}
              activeItem={activeItem}
              expanded={expanded}
              setActiveItem={setActiveItem}
            />
          </>
        );
      case "1": // Admin
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
              isActive={activeItem === "homepage"}
              onClick={() => setActiveItem("homepage")}
            />
            <NavbarItem
              path="/AdminPanel"
              text={
                <FormattedMessage
                  id="navbar.adminpanel"
                  defaultMessage="AdminPanel"
                />
              }
              isActive={activeItem === "admin-panel"}
              onClick={() => setActiveItem("admin-panel")}
            />
            <NavbarItem
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
              isActive={activeItem === "support"}
              onClick={() => setActiveItem("support")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
              isActive={activeItem === "donate"}
              onClick={() => setActiveItem("donate")}
            />
            <NavbarButton
              Rule={Rule}
              activeItem={activeItem}
              expanded={expanded}
              setActiveItem={setActiveItem}
            />
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
              isActive={activeItem === "homepage"}
              onClick={() => setActiveItem("homepage")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage
                  id="navbar.support"
                  defaultMessage="support"
                />
              }
              isActive={activeItem === "support"}
              onClick={() => setActiveItem("support")}
            />
            <NavbarItem
              path="/"
              text={
                <FormattedMessage id="navbar.donate" defaultMessage="donate" />
              }
              isActive={activeItem === "donate"}
              onClick={() => setActiveItem("donate")}
            />
            <NavbarButton
              Rule={Rule}
              activeItem={activeItem}
              expanded={expanded}
              setActiveItem={setActiveItem}
            />
          </>
        );
    }
  };

  return (
    // If the screen is expanded
    <>
      <nav
        className={`flex flex-wrap bg-white sticky border-b-2 border-AshinBlue-light shadow-sm`}
      >
        <div
          className={`flex w-screen bg-white border-0 shadow-sm ${
            !expanded ? "justify-between" : ""
          }`}
        >
          <div className="p-4 pb-3 relative flex justify-between items-center">
            <Link
              to="/"
              isActive={activeItem === "homepage"}
              onClick={() => setActiveItem("homepage")}
            >
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
          <ul className="w-full absolute mt-14 bg-white">{renderLinks()}</ul>
        )}
      </nav>
    </>
  );
}

function NavbarItem({ text, isActive, onClick }) {
  return (
    <li
      className={`px-2 py-4 m-2 text-center border-b-2 ${
        isActive ? "border-AshinBlue-light" : "border-gray-200"
      } hover:border-AshinBlue-light`}
    >
      <Link
        className="items-center font-semibold border-0 rounded py-2 px-3"
        onClick={onClick}
      >
        {text}
      </Link>
    </li>
  );
}
function NavbarButton({ Rule, activeItem, expanded, setActiveItem }) {
  const [LanOpen, setLanOpen] = useState(false);
  const [UserOpen, setUserOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(window.innerWidth > 1100);
  const { locale, changeLocale } = useLanguage();
  const intl = useIntl();

  useEffect(() => {
    const handleResize = () => {
      setNavExpanded(window.innerWidth > 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  const toggleLanOpen = () => {
    setLanOpen(!LanOpen);
    setUserOpen(false);
  };

  const toggleUserOpen = () => {
    setUserOpen(!UserOpen);
    setLanOpen(false);
  };

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
  const signup = intl.formatMessage({
    id: "navbar.signup",
    defaultMessage: "signup",
  });

  useEffect(() => {
    const handleResize = () => {
      setNavExpanded(window.innerWidth > 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  let links = [];
  if (Rule == "1" || Rule == "2" || Rule == "3" || Rule == "4") {
    links = [
      {
        label: profile,
        activeItem: "profile",
        icon: <UserRoundSearch size={20} className="me-1" />,
      },
      {
        label: logout,
        activeItem: "logout",
        icon: <LogOut size={20} className="me-1" />,
      },
    ];
  } else {
    links = [
      {
        label: login,
        activeItem: "login",
        icon: <Fish size={20} className="me-1" />,
      },
      {
        label: signup,
        activeItem: "signup",
        icon: <UserRoundPlus size={20} className="me-1" />,
      },
    ];
  }
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
              {links.map((link, _) => (
                <Link
                  key={link.activeItem}
                  to="#"
                  className="flex px-2 my-1 py-1 border-b-2 border-white hover:border-AshinBlue"
                  onClick={() => setActiveItem(link.activeItem)}
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
          <NavbarItem
            key={link.activeItem}
            path={"#"}
            text={link.label}
            isActive={activeItem === link.activeItem}
            onClick={() => setActiveItem(link.activeItem)}
          />
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
      onClick={() => changeLocale(country == "gb" ? "en" : country)}
    >
      <Flag country={country.toUpperCase()} />
    </button>
  );
}
