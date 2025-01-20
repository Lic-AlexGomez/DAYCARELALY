

import React, { useState } from "react"
import { UserX, RefreshCw, Trash, Mail } from "lucide-react"

const InactiveAccountsView = () => {
  const [inactiveAccounts, setInactiveAccounts] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      lastActive: "2023-01-15",
      type: "Padre",
      reason: "No completó registro",
    },
    {
      id: 2,
      name: "María García",
      email: "maria@example.com",
      lastActive: "2023-02-20",
      type: "Profesor",
      reason: "Baja temporal",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      lastActive: "2023-03-10",
      type: "Padre",
      reason: "Inactividad prolongada",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleReactivateAccount = (id) => {
    // In a real application, you would send a request to the backend to reactivate the account
    setInactiveAccounts(
      inactiveAccounts.map((account) => (account.id === id ? { ...account, reason: "Cuenta reactivada" } : account)),
    )
  }

  const handleSendReminder = (id) => {
    // In a real application, you would send a reminder email to the user
    alert(`Recordatorio enviado a la cuenta con ID: ${id}`)
  }

  const handleDeleteAccount = (id) => {
    // In a real application, you would send a request to the backend to delete the account
    setInactiveAccounts(inactiveAccounts.filter((account) => account.id !== id))
  }

  const filteredAccounts = inactiveAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Cuentas Inactivas</h2>
      <div className="tw-mb-4">
        <input
          type="text"
          placeholder="Buscar cuentas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-w-full tw-max-w-sm"
        />
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Nombre
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Email
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Última Actividad
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Tipo
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Razón
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-flex-shrink-0 tw-h-10 tw-w-10">
                      <UserX className="tw-h-10 tw-w-10 tw-rounded-full tw-text-gray-400" />
                    </div>
                    <div className="tw-ml-4">
                      <div className="tw-text-sm tw-font-medium tw-text-gray-900">{account.name}</div>
                    </div>
                  </div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">{account.email}</div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">{account.lastActive}</div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">{account.type}</div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <div className="tw-text-sm tw-text-gray-900">{account.reason}</div>
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                  <button
                    onClick={() => handleReactivateAccount(account.id)}
                    className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2"
                  >
                    <RefreshCw className="tw-w-5 tw-h-5" />
                  </button>
                  <button
                    onClick={() => handleSendReminder(account.id)}
                    className="tw-text-yellow-600 hover:tw-text-yellow-900 tw-mr-2"
                  >
                    <Mail className="tw-w-5 tw-h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="tw-text-red-600 hover:tw-text-red-900"
                  >
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InactiveAccountsView

