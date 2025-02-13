import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Save } from "lucide-react";

const TeacherSettings = () => {
  const { store } = useContext(Context);
  const user = store.user; // Obtenemos el usuario desde el contexto

  // Estado para almacenar los datos del formulario
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    theme: "light", // Valor por defecto para el tema
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar la visibilidad del dropdown

  // Usamos useEffect para cargar los datos del usuario cuando estén disponibles
  useEffect(() => {
    if (user) {
      // Si el usuario está disponible, actualizamos el estado de settings
      setSettings({
        name: user.username || "",  // Usamos el username del usuario
        email: user.email || "",    // Usamos el correo electrónico
        theme: "light",             // Usamos el valor por defecto para el tema
      });
    }
  }, [user]); // Solo se ejecuta cuando el `user` cambia

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Configuración guardada");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Cambia el estado de la visibilidad del dropdown
  };

  // Si el usuario aún no está disponible, mostramos un mensaje de carga
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
            value={settings.name} // Usamos el nombre cargado desde el user
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            readOnly
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
            value={settings.email} // Usamos el correo cargado desde el user
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            readOnly
          />
        </div>
        <div className="tw-mb-4">
          <label htmlFor="theme" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Theme (Coming Soon)
          </label>
          {/* Contenedor del desplegable */}
          <div className="tw-relative">
            <div
              className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-bg-gray-300 tw-cursor-pointer"
              onClick={toggleDropdown} // Controlamos el clic para abrir/cerrar el dropdown
            >
              <div className="tw-text-gray-700 tw-py-1 tw-px-2">
                {settings.theme}
              </div>
            </div>
            {/* Dropdown desplegable */}
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
    </div>
  );
};

export default TeacherSettings;
