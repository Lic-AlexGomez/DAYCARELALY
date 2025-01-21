import React, { useState } from "react"
import { Save } from "lucide-react"

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    daycareName: "DaycareRainbow Slime Co.",
    email: "info@kiddyrainbowslime.com",
    phone: "(123) 456-7890",
    address: "123 Rainbow Lane, Colorful City, 12345",
    openingHours: "8:00 AM - 6:00 PM",
    maxCapacity: 50,
    theme: "light",
    logo: "https://placehold.co/100",
    currency: "USD",
    language: "es",
    timeZone: "America/Mexico_City",
    adminEmail: "",
    darkMode: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar los cambios en el backend
    alert("Configuración guardada exitosamente")
  }

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Configuración del Sistema</h1>
        </header>
        <main className="tw-p-6">
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Configuración General</h2>
              <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
                <div>
                  <label htmlFor="daycareName" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Nombre del Centro
                  </label>
                  <input
                    type="text"
                    id="daycareName"
                    name="daycareName"
                    value={settings.daycareName}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="adminEmail" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Email del Administrador
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="maxCapacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Capacidad Máxima
                  </label>
                  <input
                    type="number"
                    id="maxCapacity"
                    name="maxCapacity"
                    value={settings.maxCapacity}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
                <div>
                  <label htmlFor="openingHours" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    id="openingHours"
                    name="openingHours"
                    value={settings.openingHours}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  />
                </div>
              </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Personalización de la Interfaz</h2>
              <div className="tw-space-y-4">
                <div>
                  <label htmlFor="theme" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Tema
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={settings.theme}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Idioma
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="tw-flex tw-items-center tw-space-x-2">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={settings.darkMode}
                    onChange={handleCheckboxChange}
                    className="tw-rounded"
                  />
                  <label htmlFor="darkMode" className="tw-text-sm tw-font-medium tw-text-gray-700">
                    Modo Oscuro
                  </label>
                </div>
              </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Configuración Adicional</h2>
              <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
                <div>
                  <label htmlFor="currency" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Moneda
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="timeZone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                    Zona Horaria
                  </label>
                  <select
                    id="timeZone"
                    name="timeZone"
                    value={settings.timeZone}
                    onChange={handleInputChange}
                    className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  >
                    <option value="America/Mexico_City">Ciudad de México</option>
                    <option value="America/New_York">Nueva York</option>
                    <option value="Europe/Madrid">Madrid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Logo</h2>
              <div className="tw-flex tw-items-center">
                <img src={settings.logo || "https://placehold.co/400"} alt="Logo" className="tw-w-16 tw-h-16 tw-mr-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
              >
                <Save className="tw-w-5 tw-h-5 tw-mr-2" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage

