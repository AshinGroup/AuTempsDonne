import React, { useContext, createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../translations/languageContext";
import { FormattedMessage } from "react-intl";
import Flag from "react-flagkit";
import {
  ChevronsUpDown,
  Users2,
  Store,
  Apple,
  Truck,
  HeartHandshake,
  BookMarked,
  LogOut,
  User2,
  Languages,
} from "lucide-react";
import atd_logo_ from "../resources/atd_logo_.png";
import atd_logo_typo from "../resources/atd_logo_typo.png";

const SidebarContext = createContext();

export default function Sidebar({ activeItem, setActiveItem }) {
  const [expanded, setExpanded] = useState(() => window.innerWidth > 980);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { locale, changeLocale } = useLanguage();

  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 980);
      if (window.innerWidth < 980) {
        setDropdownOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  });

  // Function to change the active item
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 relative flex justify-between items-center">
          {
            <Link to="/">
              {!expanded ? (
                <img src={atd_logo_} alt="ATD Logo" className="w-10" />
              ) : (
                <img
                  src={atd_logo_typo}
                  alt="ATD Logo Typo"
                  className="max-w-64"
                />
              )}
            </Link>
          }
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 py-1">
            <SidebarItem
              key={"Users"}
              icon={<Users2 size={20} />}
              text={
                <FormattedMessage id="sidebar.users" defaultMessage="Users" />
              }
              active={activeItem === "Users"}
              onClick={() => handleItemClick("Users")}
            />
            <SidebarItem
              key={"Events"}
              icon={<BookMarked size={20} />}
              text={
                <FormattedMessage id="sidebar.events" defaultMessage="Events" />
              }
              active={activeItem === "Events"}
              onClick={() => handleItemClick("Events")}
            />
            <SidebarItem
              key={"Shops"}
              icon={<Store size={20} />}
              text={
                <FormattedMessage id="sidebar.Shops" defaultMessage="Shops" />
              }
              active={activeItem === "Shops"}
              onClick={() => handleItemClick("Shops")}
            />
            <SidebarItem
              key={"Stock"}
              icon={<Apple size={20} />}
              text={
                <FormattedMessage id="sidebar.Stock" defaultMessage="Stock" />
              }
              active={activeItem === "Stock"}
              onClick={() => handleItemClick("Stock")}
            />
            <SidebarItem
              key={"ToCollect"}
              icon={<Truck size={20} />}
              text={
                <FormattedMessage
                  id="sidebar.ToCollect"
                  defaultMessage="ToCollect"
                />
              }
              active={activeItem === "ToCollect"}
              onClick={() => handleItemClick("ToCollect")}
            />
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <button onClick={toggleDropdown}>
            <img
              src="https://ui-avatars.com/api/?name=Huang+Frederic&background=40A1DD&color=FFFFFF&bold=true"
              alt="User"
              className="w-10 h-10 rounded-md"
            />{" "}
          </button>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Huang Frédéric</h4>
              <span className="text-xs text-gray-600">
                huangfrederic@xyz.com
              </span>
            </div>
            <button
              onClick={toggleDropdown}
              className="p-1 text-gray-500 hover:text-AshinBlue transition-colors duration-150 ease-in-out"
            >
              <ChevronsUpDown size={25} />
            </button>
          </div>
        </div>
        <div
          className={`transition-all ease-in-out overflow-hidden ${
            dropdownOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex flex-col px-3 pb-2">
              <SidebarItem
                key={"Profile"}
                icon={<User2 size={20} />}
                text={
                  <FormattedMessage
                    id="sidebar.profile"
                    defaultMessage="Profile"
                  />
                }
                active={activeItem === "Profile"}
                onClick={() => handleItemClick("Profile")}
              />
              <SidebarItem
                key={"Logout"}
                icon={<LogOut size={20} />}
                text={
                  <FormattedMessage
                    id="sidebar.logout"
                    defaultMessage="Logout"
                  />
                }
                active={activeItem === "Logout"}
                onClick={() => handleItemClick("Logout")}
              />
              {/* International */}
              <div className="flex justify-around my-4">
                <button
                  className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-3 focus:outline-none transition ease-in-out duration-300 ${
                    locale === "en"
                      ? "from-AshinBlue-light to-AshinBlue-dark"
                      : " from-gray-300 to-gray-400"
                  }`}
                  onClick={() => changeLocale("en")}
                >
                  <Flag country="GB" />
                </button>
                <button
                  className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-3 focus:outline-none transition ease-in-out duration-300 ${
                    locale === "fr"
                      ? "from-AshinBlue-light to-AshinBlue-dark"
                      : " from-gray-300 to-gray-400"
                  }`}
                  onClick={() => changeLocale("fr")}
                >
                  {" "}
                  <Flag country="FR" />
                </button>
                <button
                  className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-3 focus:outline-none transition ease-in-out duration-300 ${
                    locale === "es"
                      ? "from-AshinBlue-light to-AshinBlue-dark"
                      : " from-gray-300 to-gray-400"
                  }`}
                  onClick={() => changeLocale("es")}
                >
                  {" "}
                  <Flag country="ES" />
                </button>
                <button
                  className={`rounded-full bg-gradient-to-tr hover:from-AshinBlue-light hover:to-AshinBlue-dark p-3 focus:outline-none transition ease-in-out duration-300 ${
                    locale === "cn"
                      ? "from-AshinBlue-light to-AshinBlue-dark"
                      : " from-gray-300 to-gray-400"
                  }`}
                  onClick={() => changeLocale("cn")}
                >
                  {" "}
                  <Flag country="CN" />
                </button>
              </div>
            </ul>
          </SidebarContext.Provider>
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text, active, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors ease-in-out ${expanded ? "group" : ""}
        ${
          active
            ? "bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark text-white"
            : "text-gray-500"
        }
        hover:bg-gradient-to-tr from-AshinBlue-light to-AshinBlue-dark hover:text-white
      `}
    >
      {icon}
      <span
        className={`ml-3 overflow-hidden ease-in-out ${
          expanded ? "inline" : "hidden"
        }`}
      >
        {text}
      </span>
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-AshinBlue text-AshinBlue text-sm
            invisible opacity-0 transition-opacity
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
