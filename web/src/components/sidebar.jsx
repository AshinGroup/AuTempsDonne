import React, { useContext, createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../translations/languageContext";
import { FormattedMessage } from "react-intl";
import {
  ChevronsUpDown,
  Users2,
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
  const { changeLocale } = useLanguage();

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
              key={"Activities"}
              icon={<HeartHandshake size={20} />}
              text={
                <FormattedMessage
                  id="sidebar.activities"
                  defaultMessage="Activities"
                />
              }
              active={activeItem === "Activities"}
              onClick={() => handleItemClick("Activities")}
            />
            <SidebarItem
              key={"Courses"}
              icon={<BookMarked size={20} />}
              text={
                <FormattedMessage
                  id="sidebar.courses"
                  defaultMessage="Courses"
                />
              }
              active={activeItem === "Courses"}
              onClick={() => handleItemClick("Courses")}
            />
            <SidebarItem
              key={"English"}
              icon={<Languages size={20} />}
              text={"English"}
              active={activeItem === "English"}
              onClick={() => changeLocale("en")}
            />
            <SidebarItem
              key={"French"}
              icon={<Languages size={20} />}
              text={"Français"}
              active={activeItem === "French"}
              onClick={() => changeLocale("fr")}
            />
            <SidebarItem
              key={"Chinese"}
              icon={<Languages size={20} />}
              text={"普通话"}
              active={activeItem === "Chinese"}
              onClick={() => changeLocale("cn")}
            />
            <SidebarItem
              key={"Russian"}
              icon={<Languages size={20} />}
              text={"русский"}
              active={activeItem === "Russian"}
              onClick={() => changeLocale("ru")}
            />
            <SidebarItem
              key={"Hindi"}
              icon={<Languages size={20} />}
              text={"हिंदी"}
              active={activeItem === "Hindi"}
              onClick={() => changeLocale("hi")}
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
