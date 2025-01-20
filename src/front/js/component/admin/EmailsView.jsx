import React, { useState } from "react"
import { Send, Trash, Edit, Calendar } from "lucide-react"

const EmailManagementPage = () => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      to: "padres@example.com",
      subject: "Recordatorio: Evento de fin de curso",
      content: "Estimados padres...",
      date: "2023-05-25",
    },
    {
      id: 2,
      to: "profesores@example.com",
      subject: "Reunión de personal",
      content: "Querido equipo...",
      date: "2023-05-26",
    },
  ])

  const [newEmail, setNewEmail] = useState({ to: "", subject: "", content: "", scheduledDate: "" })
  const [scheduledEmails, setScheduledEmails] = useState([
    { id: 1, subject: "Bienvenida a nuevos padres", recipients: "Nuevos registros", scheduledDate: "2023-07-01" },
    { id: 2, subject: "Recordatorio de pago", recipients: "Todos los padres", scheduledDate: "2023-07-05" },
    { id: 3, subject: "Evento de verano", recipients: "Todos", scheduledDate: "2023-07-10" },
  ])

  const handleInputChange = (e) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value })
  }

  const handleSendEmail = (e) => {
    e.preventDefault()
    if (newEmail.scheduledDate) {
      setScheduledEmails([
        ...scheduledEmails,
        {
          id: scheduledEmails.length + 1,
          subject: newEmail.subject,
          recipients: newEmail.to,
          scheduledDate: newEmail.scheduledDate,
        },
      ])
    } else {
      setEmails([
        ...emails,
        {
          id: emails.length + 1,
          ...newEmail,
          date: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setNewEmail({ to: "", subject: "", content: "", scheduledDate: "" })
  }

  const handleDeleteEmail = (id) => {
    setEmails(emails.filter((email) => email.id !== id))
  }

  const handleDeleteScheduledEmail = (id) => {
    setScheduledEmails(scheduledEmails.filter((email) => email.id !== id))
  }

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
    
      <div className="tw-flex-1 tw-overflow-auto">
        <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
          <h1 className="tw-text-2xl tw-font-bold">Gestión de Correos</h1>
          
        </header>
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Crear Nuevo Correo</h2>
            <form onSubmit={handleSendEmail} className="tw-space-y-4">
              <input
                type="email"
                name="to"
                value={newEmail.to}
                onChange={handleInputChange}
                placeholder="Para"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                required
              />
              <input
                type="text"
                name="subject"
                value={newEmail.subject}
                onChange={handleInputChange}
                placeholder="Asunto"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                required
              />
              <textarea
                name="content"
                value={newEmail.content}
                onChange={handleInputChange}
                placeholder="Contenido del correo"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-h-32"
                required
              ></textarea>
              <div className="tw-flex tw-items-center tw-space-x-4">
                <input
                  type="date"
                  name="scheduledDate"
                  value={newEmail.scheduledDate}
                  onChange={handleInputChange}
                  className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
                <button
                  type="submit"
                  className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
                >
                  <Send className="tw-w-5 tw-h-5 tw-mr-2" />
                  {newEmail.scheduledDate ? "Programar Correo" : "Enviar Correo"}
                </button>
              </div>
            </form>
          </div>

          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Correos Programados</h2>
            <table className="tw-w-full">
              <thead className="tw-bg-gray-50">
                <tr>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Asunto
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Destinatarios
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Fecha Programada
                  </th>
                  <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
                {scheduledEmails.map((email) => (
                  <tr key={email.id}>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{email.subject}</td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{email.recipients}</td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{email.scheduledDate}</td>
                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                      <button className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2">
                        <Edit className="tw-w-5 tw-h-5" />
                      </button>
                      <button
                        className="tw-text-red-600 hover:tw-text-red-900"
                        onClick={() => handleDeleteScheduledEmail(email.id)}
                      >
                        <Trash className="tw-w-5 tw-h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Correos Enviados</h2>
            <div className="tw-space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                    <span className="tw-font-semibold">{email.to}</span>
                    <span className="tw-text-sm tw-text-gray-500">{email.date}</span>
                  </div>
                  <h3 className="tw-text-lg tw-font-medium tw-mb-2">{email.subject}</h3>
                  <p className="tw-text-gray-600 tw-mb-4">{email.content}</p>
                  <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteEmail(email.id)}>
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmailManagementPage

