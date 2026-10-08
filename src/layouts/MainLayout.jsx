import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="hrms-app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* Main Layout Area */}
      <div className={`hrms-layout-main ${isCollapsed ? 'hrms-layout-main--collapsed' : ''}`}>
        {/* Top Navbar Header */}
        <Header onToggleMobile={handleToggleMobile} />

        {/* Dynamic Page Body Content Area */}
        <main style={{ flex: 1, padding: '1.5rem 1.5rem 3rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
