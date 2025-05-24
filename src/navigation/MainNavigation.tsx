import React, { useState } from 'react';
import Sidebar from './Sidebar';
import PageHeader from './PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type MainNavigationProps = React.PropsWithChildren<{}>;

const MainNavigation: React.FC<MainNavigationProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white ">
      {/* Sidebar (responsive) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      
      {/* Main area */}
      <div className="flex flex-col flex-1">
        {/* Page header: shows hamburger on mobile */}
        <PageHeader  />
        {/* Hamburger dưới header - chỉ hiển thị trên mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden cursor-pointer hover:border-blue-400 hover:text-blue-400 absolute bg-white rounded-r-lg w-fit py-2 px-3 border border-gray-200 mt-16"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>

        {/* Content */}
        <main className="mt-16 overflow-y-auto h-[calc(100vh-64px)] bg md:p-6 p-3 bg-[#F5F5F5]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainNavigation;
