import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faCircleUser, faAngleLeft, faAngleRight, } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/GeekUp_Logo.jpg";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { pathname } = useLocation();
  const [isOpenText, setIsOpenText] = React.useState(() => {
  const stored = localStorage.getItem("sidebarTextState");
    return stored ? JSON.parse(stored) : true;
  });

  React.useEffect(() => {
    localStorage.setItem("sidebarTextState", JSON.stringify(isOpenText));
  }, [isOpenText]);


  const menuItems = [
    { label: "Albums", icon: faListAlt, to: "/albums" },
    { label: "Users", icon: faCircleUser, to: "/users" },
  ];

  return (
    <>
      {/* ===== Overlay for Mobile ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <nav
        className={`
          fixed top-0 left-0 z-50 h-full ${isOpenText ?"w-52" :"w-20 "} bg-white shadow-md transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        {/* ===== Logo ===== */}
        {isOpenText ?( <div className="flex items-center h- p-4">
          <img src={logo} alt="GeekUp Logo" className="h-7" />
        </div>):(<div className={`w-52 h-16 flex items-center pl-2`}>
          <img src={logo} alt="GeekUp Logo" className="h-10" />
        </div>)}
       
        

        {/* ===== Menu ===== */}
        <ul className="mt-4">
          {menuItems.map(({ label, icon, to }) => {
            const isActive = pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setIsOpen(false)} // Auto-close on mobile
                  className={`
                    flex items-center ${isOpenText ? "px-5 py-2.5 mr-3" : "justify-center p-2.5"} 
                    m-2 rounded-md text-sm font-medium transition-all duration-200 no-underline
                    ${isActive
                      ? "bg-sky-100 text-[#1677ff] scale-[1.03]"
                      : "text-black hover:bg-gray-200 active:bg-sky-100"
                    }
                    active:scale-[0.98]
                  `}
                >
                  <FontAwesomeIcon icon={icon} className="text-base" />
                  {isOpenText && <span className="ml-3">{label}</span>}
                </Link>
              </li>

            );
          })}
        </ul>
        {!isOpen && (
        <div className="absolute cursor-pointer bottom-0 left-0 w-full h-8 items-center justify-center text-center">
          <button>
            <FontAwesomeIcon 
              icon={isOpenText ? faAngleLeft : faAngleRight}
              onClick={() => setIsOpenText(!isOpenText)}  
              className="text-blue-400 cursor-pointer"
          /></button>
        </div>
        )}
      </nav>

      
    </>
  );
};

export default Sidebar;
