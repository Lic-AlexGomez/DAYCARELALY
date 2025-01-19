import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h1 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Panel de Administración</h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <button className="tw-text-gray-500 hover:tw-text-gray-700">
              <Bell className="tw-w-6 tw-h-6" />
            </button>
            <button className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-gray-900">
              <User className="tw-w-6 tw-h-6 tw-mr-2" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

