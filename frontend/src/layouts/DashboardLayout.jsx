import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopHeader from '../components/common/TopHeader';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left var(--transition-normal)',
        }}
        className="main-layout-container"
      >
        <TopHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main
          style={{
            flex: 1,
            padding: '2rem 2.25rem',
            maxWidth: '1380px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
          className="dashboard-main-content"
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .main-layout-container {
            margin-left: 0 !important;
          }
          .dashboard-main-content {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
