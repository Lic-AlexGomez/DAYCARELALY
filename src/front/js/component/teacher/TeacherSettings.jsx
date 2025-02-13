import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Save } from "lucide-react";

const TeacherSettings = () => {
  const { store, actions } = useContext(Context); 
  const user = store.user; 

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    theme: "light", 
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.username || "",  
        email: user.email || "",    
        theme: "light",             
      });
    }
  }, [user]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await actions.updateUser({
      username: settings.name,
      email: settings.email,
    });

    if (result.success) {
      setShowModal(true); 
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); 
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Configuration</h3>
      <form onSubmit={handleSubmit} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
        <div className="tw-mb-4">
          <label htmlFor="name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={settings.name} 
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          />
        </div>
        <div className="tw-mb-4">
          <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email} 
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          />
        </div>
        <div className="tw-mb-4">
          <label htmlFor="theme" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Theme (Coming Soon)
          </label>
          <div className="tw-relative">
            <div
              className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-bg-gray-300 tw-cursor-pointer"
              onClick={toggleDropdown} 
            >
              <div className="tw-text-gray-700 tw-py-1 tw-px-2">
                {settings.theme}
              </div>
            </div>
            {isDropdownOpen && (
              <div className="tw-absolute tw-top-full tw-left-0 tw-w-full tw-bg-gray-300 tw-border tw-border-gray-500 tw-rounded-md tw-mt-1">
                <div className="tw-p-2">
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div className="tw-w-4 tw-h-4 tw-bg-yellow-100 tw-rounded-full"></div>
                    <span>Light</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div className="tw-w-4 tw-h-4 tw-bg-gray-800 tw-rounded-full"></div>
                    <span>Dark</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div className="tw-w-4 tw-h-4 tw-bg-blue-100 tw-rounded-full"></div>
                    <span>Light Blue</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div className="tw-w-4 tw-h-4 tw-bg-green-800 tw-rounded-full"></div>
                    <span>Dark Green</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <div className="tw-w-4 tw-h-4 tw-bg-pink-300 tw-rounded-full"></div>
                    <span>Soft Pink</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="tw-text-sm tw-text-gray-500 tw-mt-2">
            These are future theme options. The functionality is coming soon!
          </p>
        </div>
        <button
          type="submit"
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
        >
          <Save className="tw-w-5 tw-h-5 tw-mr-2" />
          Save Changes
        </button>
      </form>

      {showModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-p-6 tw-w-1/3">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Success</h2>
            <p className="tw-text-gray-700">Your settings have been updated successfully!</p>
            <div className="tw-flex tw-justify-end tw-mt-4">
              <button
                onClick={() => setShowModal(false)} 
                className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeacherSettings;
