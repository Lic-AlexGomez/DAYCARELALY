import React, { useContext } from "react";
import { Context } from "../../store/appContext";
import { Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const TeacherHeader = ({ onLogout }) => {
  const { store } = useContext(Context);
  const user = store.user; // Obtenemos el usuario del store

  console.log("USUARIO EN HEADER:", user); // 👀 Verifica qué está llegando

  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h1 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Panel del Profesor</h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <button className="tw-text-gray-500 hover:tw-text-gray-700">
              <Bell className="tw-w-6 tw-h-6" />
            </button>
            <Link
              to="/teacher-dashboard/profile"
              className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-gray-900"
            >
              <User className="tw-w-6 tw-h-6 tw-mr-2" />
              {user ? user.username : "Profesor"} {/* Usamos `username` en lugar de `name` */}
            </Link>
            <button onClick={onLogout} className="tw-flex tw-items-center tw-text-gray-700 hover:tw-text-gray-900">
              <LogOut className="tw-w-6 tw-h-6 tw-mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TeacherHeader;
