import React, { useContext, useEffect, useState } from "react";
import { Bell, User, ShoppingBag, LogOut } from "lucide-react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ParentHeader = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.fetchParentData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-4 sm:tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          {/* Título del Panel */}
          <h1 className="tw-text-xl sm:tw-text-2xl tw-font-semibold tw-text-gray-800 tw-ml-12">
            Parent Panel
          </h1>

          {/* Contenedor de Iconos y Acciones */}
          <div className="tw-flex tw-items-center tw-space-x-2 sm:tw-space-x-4">
            {/* Icono de Notificaciones */}
            <button className="tw-text-gray-500 hover:tw-text-gray-700 tw-p-2 sm:tw-p-0">
              <Bell className="tw-w-5 tw-h-5 sm:tw-w-6 sm:tw-h-6" />
            </button>

            {/* Nombre de Usuario */}
            <div className="tw-hidden sm:tw-flex tw-items-center tw-space-x-2">
              <User className="tw-w-5 tw-h-5 sm:tw-w-6 sm:tw-h-6 tw-text-gray-700" />
              <span className="tw-text-gray-700">
                {store.user?.username || "Cargando..."}
              </span>
            </div>

            {/* Icono de Compras */}
            <Link to={"/parent-dashboard/payments"}>
              <button className="tw-relative tw-text-red-500 tw-p-2 sm:tw-p-0">
                <ShoppingBag className="tw-w-5 tw-h-5 sm:tw-w-6 sm:tw-h-6" />
                {store.enrolledClasses.length > 0 && (
                  <span className="tw-absolute tw-top-0 tw-right-0 tw-w-4 tw-h-4 sm:tw-w-4 sm:tw-h-4 tw-bg-blue-500 tw-text-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs">
                    {store.enrolledClasses.length}
                  </span>
                )}
              </button>
            </Link>

            {/* Botón de Cerrar Sesión */}
            <button
              className="tw-flex tw-items-center tw-px-3 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-100 tw-rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="tw-w-4 tw-h-4 tw-mr-2" />
              <span className="tw-hidden sm:tw-inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;