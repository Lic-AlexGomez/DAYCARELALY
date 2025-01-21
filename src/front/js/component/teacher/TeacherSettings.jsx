import React, { useState } from "react"
import { Save } from "lucide-react"

const TeacherSettings = () => {
  const [settings, setSettings] = useState({
    name: "Prof. García",
    email: "prof.garcia@example.com",
    phone: "(123) 456-7890",
    notifications: true,
    theme: "light",
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la configuración
    alert("Configuración guardada")
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Configuración</h3>
      <form onSubmit={handleSubmit} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
        <div className="tw-mb-4">
          <label htmlFor="name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Nombre
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
            Correo Electrónico
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
        <div className="tw-mb-4">
          <label className="tw-flex tw-items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleInputChange}
              className="tw-mr-2"
            />
            <span className="tw-text-sm tw-text-gray-700">Recibir notificaciones</span>
          </label>
        </div>
        <div className="tw-mb-4">
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
          </select>
        </div>
        <button
          type="submit"
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
        >
          <Save className="tw-w-5 tw-h-5 tw-mr-2" />
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}

export default TeacherSettings

