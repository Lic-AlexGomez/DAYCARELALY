import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { Bell, User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react"

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const navigate = useNavigate()
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
  
  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const handleSettings = () => {
    // Add navigation to settings page logic here
    console.log("Navigating to settings...")
  }


  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h1 className="md:tw-text-2xl tw-font-semibold tw-text-gray-800 tw-ms-8 sm:tw-text-sm ">Administration Panel</h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <button className="tw-text-gray-500 hover:tw-text-gray-700" aria-label="Notifications">
              <Bell className="tw-w-6 tw-h-6" />
            </button>
            <div className="tw-relative">
              <button
                className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-gray-900"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <User className="tw-w-6 tw-h-6 tw-mr-2" />
                <span>Admin</span>
                <ChevronDown className="tw-w-4 tw-h-4 tw-ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-48 tw-bg-white tw-rounded-md tw-shadow-lg tw-py-1 tw-z-10">
                  <Link to="/admin-dashboard/profile"
                    className="tw-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-100 tw-w-full tw-text-left" 
                  >
                    <UserCircle className="tw-w-4 tw-h-4 tw-mr-2" />
                    Configure Profile
                  </Link>
                  <Link to="/admin-dashboard/settings"
                    className="tw-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-100 tw-w-full tw-text-left"
                  >
                    <Settings className="tw-w-4 tw-h-4 tw-mr-2" />
                    Configuration
                  </Link>
                  <button
                    className="tw-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-100 tw-w-full tw-text-left"
                    onClick={handleLogout}
                  >
                    <LogOut className="tw-w-4 tw-h-4 tw-mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}



export default Header;

