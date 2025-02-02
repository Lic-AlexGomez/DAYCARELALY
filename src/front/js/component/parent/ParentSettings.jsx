import React, { useState, useEffect, useContext } from "react"
import { Save } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentSettings = () => {
  const { store, actions } = useContext(Context)
  const [settings, setSettings] = useState(store.parentSettings || {})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      await actions.fetchParentSettings()
      setIsLoading(false)
    }
    loadSettings()
  }, [actions.fetchParentSettings])

  useEffect(() => {
    if (store.parentSettings) {
      setSettings(store.parentSettings)
    }
  }, [store.parentSettings])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    actions.updateParentSettings(settings)
  }

  if (isLoading) {
    return <div>Loading settings...</div>
  }
console.log(store.parentSettings)
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
            value={settings.name || ""}
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
            value={settings.email || ""}
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
            value={settings.phone || ""}
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          />
        </div>
        <div className="tw-mb-4">
          <label className="tw-flex tw-items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications || false}
              onChange={handleInputChange}
              className="tw-mr-2"
            />
            <span className="tw-text-sm tw-text-gray-700">Recibir notificaciones</span>
          </label>
        </div>
        <div className="tw-mb-4">
          <label htmlFor="language" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Idioma
          </label>
          <select
            id="language"
            name="language"
            value={settings.language || "es"}
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
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

export default ParentSettings

