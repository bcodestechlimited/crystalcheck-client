import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import crystalChecksLogo from "../../assets/images/Crystal-check-logo.png";
import { useAuthActions, useAuthStore } from "../../store/useAuthStore";
import Button from "../Button";
import { companies } from "../../constants/companies.js";
import {
  ChevronUp,
  House,
  HouseIcon,
  LogOut,
  ShieldCheck,
  SquareUserRound,
  Users,
} from "lucide-react";

const Dropdown = ({
  title,
  children,
  isOpen,
  toggleDropdown,
  icon,
  isActive,
}) => {
  const cls = isActive
    ? "bg-primary text-white"
    : "text-primary border border-gray-300";

  return (
    <NavLink className="relative" to="/partners">
      <button
        className={`text-primary border border-gray-300 p-2 font-normal text-lg rounded-md flex items-center justify-between w-full ${cls}`}
        onClick={toggleDropdown}
      >
        <span className="text-sm flex gap-2">
          {icon} {title}
        </span>
        <ChevronUp
          size={16}
          className={`transition-all transform ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {isOpen && (
        <div className="bg-white shadow-md rounded-md mt-2 max-h-60 overflow-y-auto">
          {children.map(({ id, name, link, logo }) => (
            <NavLink
              key={id}
              to={`/partners${link}`}
              className={`px-4 py-2 hover:bg-gray-100 text-primary border text-xs font-semibold flex items-center gap-2`}
              title={name}
            >
              <img src={logo} className="w-6" alt="" />
              {name}
            </NavLink>
          ))}
        </div>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuthActions();
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const role = user?.roles?.includes("superAdmin") ? "Super Admin" : "Admin";

  const navLinks = [
    {
      to: "/",
      title: "Home",
      activeIcon: <House size={18} />,
      inactiveIcon: <HouseIcon size={18} />,
      matchPath: "/",
    },
    {
      to: "/field-officers",
      title: "Field Officers",
      activeIcon: <SquareUserRound size={18} />,
      inactiveIcon: <SquareUserRound size={18} />,
      matchPath: "/field-officers",
    },
    {
      title: `Partners (${companies.length})`,
      dropdown: true,
      activeIcon: <Users size={18} />,
      inactiveIcon: <Users size={18} />,
      children: companies,
    },
    user?.roles?.includes("superAdmin") && {
      to: "/admin",
      title: "Super Admin",
      activeIcon: <ShieldCheck size={18} />,
      inactiveIcon: <ShieldCheck size={18} />,
      matchPath: "/admin",
    },
  ];

  const getLinkClass = (isActive) =>
    isActive ? "bg-primary text-white" : "text-primary border border-gray-300";

  const isActiveLink = (matchPath) =>
    pathname === matchPath || pathname.startsWith(`${matchPath}/`);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col justify-between h-full w-[140px] md:w-[180px]">
      <div className="flex flex-col gap-2">
        <img
          src={crystalChecksLogo}
          className="w-40 hidden xl:block py-4"
          alt="Crystal Check Logo"
        />

        {navLinks.filter(Boolean).map((navItem) => {
          const {
            to,
            title,
            activeIcon,
            inactiveIcon,
            matchPath,
            dropdown,
            children,
          } = navItem;

          return dropdown ? (
            <Dropdown
              key={title}
              title={title}
              children={children}
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              icon={inactiveIcon}
              isActive={pathname.startsWith("/partners")}
            />
          ) : (
            <NavLink
              key={to}
              to={to}
              title={title?.toLowerCase()}
              className={() =>
                `${getLinkClass(
                  isActiveLink(matchPath)
                )} p-2 font-normal text-lg rounded-md flex items-center`
              }
            >
              {isActiveLink(matchPath) ? activeIcon : inactiveIcon}
              <span className="pl-2 text-sm">{title}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <p className="border p-2 rounded text-sm">
          Role: <span className="font-semibold text-primary">{role}</span>
        </p>
        <Button
          text={
            <>
              <LogOut size={18} />
              <span className="xl:block text-sm">Logout</span>
            </>
          }
          onClick={logout}
          className="text-primary w-full flex items-center gap-2 p-2 text-lg font-normal rounded-md border hover:bg-gray-100"
        />
      </div>
    </div>
  );
}
