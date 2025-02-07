"use client"

import React, { useState, useEffect,useContext } from "react"
import { Save, Loader2 } from "lucide-react"
import { Context } from "../../store/appContext"

// UI Components
const Card = ({ className, children, ...props }) => (
  <div className={`tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const baseStyles =
    "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-pointer-events-none tw-ring-offset-background"
  const variants = {
    default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
    outline: "tw-border tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground",
  }
  const sizes = {
    default: "tw-h-10 tw-py-2 tw-px-4",
    sm: "tw-h-9 tw-px-3",
    lg: "tw-h-11 tw-px-8",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Input = ({ className, ...props }) => (
  <input
    className={`tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${className}`}
    {...props}
  />
)

const SettingsView = () => {
  const { actions, store } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  console.log(store)
  const [settings, setSettings] = useState({
    id: store.user.id,
    name_daycare: "",
    admin_email: "",
    max_capacity: 0,
    phone: "",
    schedule_attention: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    image: "",
    address: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        actions.fetchSettings()
      } catch (error) {
        console.error("Error al cargar las configuraciones:", error)
        setError("No se pudo cargar la configuración. Por favor, intente de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (store.settings && store.settings.length > 0) {
      setSettings(store.settings[0])
    }
  }, [store.settings])

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const result = await actions.uploadToCloudinary(file)
        console.log(result)
        if (result.success) {
          setSettings((prevState) => ({
            ...prevState,
            image: result.url,
          }))
        } else {
          throw new Error(result.error || "Error al subir la imagen")
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error)
        setError("No se pudo subir la imagen. Por favor, intente de nuevo.")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    console.log(settings)
    if (!settings.id) {
      setError("ID no está definido")
      setIsLoading(false)
      return
    }

    try {
      const result = await actions.updateSettings(settings.id, settings)
      console.log(result)
      if (result) {
        await actions.fetchSettings()
        alert("Configuración actualizada correctamente")
      } else {
        throw new Error(result.error || "Error al actualizar la configuración")
      }
    } catch (error) {
      console.error("Error al actualizar la configuración:", error)
      setError("No se pudo actualizar la configuración. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-screen">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
      </div>
    )
  }

  return (
    <div className="tw-container tw-mx-auto tw-p-4">
      <h1 className="tw-text-3xl tw-font-bold tw-mb-6">Configuración del Sistema</h1>
      {error && (
        <div
          className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative tw-mb-4"
          role="alert"
        >
          <strong className="tw-font-bold">Error: </strong>
          <span className="tw-block tw-sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="tw-space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración General</CardTitle>
          </CardHeader>
          <CardContent className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
            <div>
              <label htmlFor="name_daycare" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Nombre del Centro
              </label>
              <Input
                type="text"
                id="name_daycare"
                name="name_daycare"
                value={settings.name_daycare || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="admin_email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Email del Administrador
              </label>
              <Input
                type="email"
                id="admin_email"
                name="admin_email"
                value={settings.admin_email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="max_capacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Capacidad Máxima
              </label>
              <Input
                type="number"
                id="max_capacity"
                name="max_capacity"
                value={settings.max_capacity || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Teléfono
              </label>
              <Input type="tel" id="phone" name="phone" value={settings.phone || ""} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Dirección
              </label>
              <Input
                type="text"
                id="address"
                name="address"
                value={settings.address || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="schedule_attention"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
              >
                Horario de Atención
              </label>
              <Input
                type="text"
                id="schedule_attention"
                name="schedule_attention"
                value={settings.schedule_attention || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
            <div>
              <label htmlFor="facebook" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Facebook
              </label>
              <Input
                type="text"
                id="facebook"
                name="facebook"
                value={settings.facebook || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="twitter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Twitter
              </label>
              <Input
                type="text"
                id="twitter"
                name="twitter"
                value={settings.twitter || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="instagram" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Instagram
              </label>
              <Input
                type="text"
                id="instagram"
                name="instagram"
                value={settings.instagram || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                LinkedIn
              </label>
              <Input
                type="text"
                id="linkedin"
                name="linkedin"
                value={settings.linkedin || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent>
            {settings.image && (
              <div className="tw-mb-4">
                <img
                  src={settings.image || "/placeholder.svg"}
                  alt="Logo del Centro"
                  className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md"
                />
              </div>
            )}
            <div>
              <label htmlFor="image" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                Subir nuevo logo
              </label>
              <Input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="tw-mr-2 tw-h-4 tw-w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsView

