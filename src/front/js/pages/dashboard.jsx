import React from 'react';
import Sidebar from '../component/Sidebar.jsx';
import Header from '../component/Header.jsx';
import DashboardContent from '../component/DahboardContent.jsx';

export const AdminDashboard = () => {
  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <Sidebar />
      <div className="tw-flex-1 tw-overflow-auto">
        <Header />
        <main className="tw-p-6">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

