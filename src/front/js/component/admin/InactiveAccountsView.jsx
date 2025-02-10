import React, { useState, useEffect, useContext } from "react"
import { UserX, RefreshCw, Trash, Mail } from "lucide-react"
import { Context } from "../../store/appContext"

const InactiveAccountsView = () => {
  const { store, actions } = useContext(Context)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    actions.fetchInactiveAccounts()
  }, [])

  const handleReactivateAccount = async (id,name) => {
    const result = await actions.reactivateAccount(id)
    if (result.success) {
      alert(`Cuenta con ID ${id} y Nombre ${name} reactivada`)
    } else {
      console.error("Failed to reactivate account:", result.error)
    }
  }

  const handleSendReminder = async (id,name) => {
    const result = await actions.sendReminder(id)
    if (result.success) {
      alert(`Recordatorio enviado a la cuenta con ID: ${id} y Nombre: ${name}`)
    } else {
     
      console.error("Failed to send reminder:", result.error)
    }
  }

  const handleDeleteAccount = async (id,name) => {
    const result = await actions.deleteInactiveAccount(id)
    if (result.success) {
      alert(`Cuenta con ID ${id} y Nombre: ${name} eliminada`)
    } else {
      
      console.error("Failed to delete account:", result.error)
    }
  }

  const filteredAccounts = store.parentChildren.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Inactive Accounts</h2>
      <div className="tw-mb-4">
        <input
          type="text"
          placeholder="Search Account..."
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
                Name
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Email
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Latest Activity
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Type
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Reason
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Actions
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
                    onClick={() => handleReactivateAccount(account.id, account.name)}
                    className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2"
                  >
                    <RefreshCw className="tw-w-5 tw-h-5" />
                  </button>
                  <button
                    onClick={() => handleSendReminder(account.id, account.name)}
                    className="tw-text-yellow-600 hover:tw-text-yellow-900 tw-mr-2"
                  >
                    <Mail className="tw-w-5 tw-h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id, account.name)}
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

