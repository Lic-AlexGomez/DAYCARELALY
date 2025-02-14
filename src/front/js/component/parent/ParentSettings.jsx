import React, { useState, useEffect, useContext } from "react"
import { Save } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentSettings = () => {
  const { store, actions } = useContext(Context)
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Función para obtener el email desde el localStorage
  const getUserEmailFromStorage = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user?.email || ""
  }

  // Función para obtener el username desde el localStorage
  const getUsernameFromStorage = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user?.username || ""
  }

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await actions.fetchParentSettings()
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading settings:", error)
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [actions.fetchParentSettings])

  useEffect(() => {
    if (store.parentSettings) {
      setSettings(store.parentSettings)
    }
  }, [store.parentSettings])

  // Actualizar el estado del username y email si se cargan desde localStorage
  useEffect(() => {
    const emailFromStorage = getUserEmailFromStorage()
    const usernameFromStorage = getUsernameFromStorage()

    setSettings((prevSettings) => ({
      ...prevSettings,
      email: emailFromStorage,
      name: usernameFromStorage,
    }))
  }, []) // Se ejecuta una vez al inicio

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await actions.updateParentSettings(settings)
      alert("Settings updated successfully!")
    } catch (error) {
      console.error("Error updating settings:", error)
      alert("Failed to update settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading settings...</div>
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Configuration</h3>
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
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={getUserEmailFromStorage()}
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          />
        </div>
        {/* <div className="tw-mb-4">
          <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={settings.phone || ""}
            onChange={handleInputChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
          />
        </div> */}
        <div className="tw-mb-4">
          <label className="tw-flex tw-items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications || false}
              onChange={handleInputChange}
              className="tw-mr-2"
            />
            <span className="tw-text-sm tw-text-gray-700">Receive notifications</span>
          </label>
        </div>
        <div className="tw-mb-4">
          <label htmlFor="language" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
            Language
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
          disabled={isSaving}
        >
          <Save className="tw-w-5 tw-h-5 tw-mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}

export default ParentSettings
