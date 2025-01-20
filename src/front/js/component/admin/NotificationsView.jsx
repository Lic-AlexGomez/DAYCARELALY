import React, { useState } from "react"
import { Bell, Search, Trash2, Eye, X } from "lucide-react"

const initialNotifications = [
  { id: 1, type: "Inscripción", message: "Nueva inscripción recibida", date: "2023-07-01" },
  { id: 2, type: "Pago", message: "Pago recibido", date: "2023-07-02" },
  { id: 3, type: "Evento", message: "Nuevo evento creado", date: "2023-07-03" },
]

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationPreferences, setNotificationPreferences] = useState({
    Inscripción: true,
    Pago: true,
    Evento: true,
  })
  const [selectedNotification, setSelectedNotification] = useState(null)

  const filteredNotifications = notifications.filter(
    (notification) =>
      (filter === "all" || notification.type === filter) &&
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const handleToggleNotificationPreference = (type) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification)
  }

  const handleCloseModal = () => {
    setSelectedNotification(null)
  }

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
    
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Gestión de Notificaciones</h1>

        </header>
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Configuración de Notificaciones</h2>
            <div className="tw-space-y-4">
              {Object.entries(notificationPreferences).map(([type, isEnabled]) => (
                <div key={type} className="tw-flex tw-items-center tw-justify-between">
                  <label htmlFor={`${type}-switch`} className="tw-font-medium">
                    Notificaciones de {type}
                  </label>
                  <div
                    className={`tw-w-14 tw-h-7 tw-flex tw-items-center tw-rounded-full tw-p-1 tw-cursor-pointer ${
                      isEnabled ? "tw-bg-green-500" : "tw-bg-gray-300"
                    }`}
                    onClick={() => handleToggleNotificationPreference(type)}
                  >
                    <div
                      className={`tw-bg-white tw-w-5 tw-h-5 tw-rounded-full tw-shadow-md tw-transform tw-transition-transform tw-duration-300 ${
                        isEnabled ? "tw-translate-x-7" : ""
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Historial de Notificaciones</h2>
            <div className="tw-mb-4 tw-flex tw-justify-between">
              <div className="tw-relative">
                <input
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw-border tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-w-64"
                />
                <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400 tw-w-5 tw-h-5" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="tw-border tw-rounded-md tw-px-3 tw-py-2 tw-w-48"
              >
                <option value="all">Todos</option>
                <option value="Inscripción">Inscripción</option>
                <option value="Pago">Pago</option>
                <option value="Evento">Evento</option>
              </select>
            </div>
            <table className="tw-w-full">
              <thead className="tw-bg-gray-50">
                <tr>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Tipo
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Mensaje
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Fecha
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id}>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                      <span
                        className={`tw-px-2 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full ${
                          notification.type === "Inscripción"
                            ? "tw-bg-green-100 tw-text-green-800"
                            : notification.type === "Pago"
                              ? "tw-bg-blue-100 tw-text-blue-800"
                              : "tw-bg-yellow-100 tw-text-yellow-800"
                        }`}
                      >
                        {notification.type}
                      </span>
                    </td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{notification.message}</td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{notification.date}</td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                      <button
                        onClick={() => handleViewDetails(notification)}
                        className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2"
                      >
                        <Eye className="tw-w-5 tw-h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="tw-text-red-600 hover:tw-text-red-900"
                      >
                        <Trash2 className="tw-w-5 tw-h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {selectedNotification && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-rounded-lg tw-p-6 tw-w-96">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h2 className="tw-text-xl tw-font-semibold">Detalles de la Notificación</h2>
              <button onClick={handleCloseModal} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-5 tw-h-5" />
              </button>
            </div>
            <div className="tw-space-y-2">
              <p>
                <strong>Tipo:</strong> {selectedNotification.type}
              </p>
              <p>
                <strong>Mensaje:</strong> {selectedNotification.message}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedNotification.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}





export default NotificationsPage

