import React, { useState } from 'react';
import { UserX, RefreshCw, Trash } from 'lucide-react';

const InactiveAccountsView = () => {
  const [inactiveAccounts, setInactiveAccounts] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', lastActive: '2023-01-15' },
    { id: 2, name: 'María García', email: 'maria@example.com', lastActive: '2023-02-20' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', lastActive: '2023-03-10' },
  ]);

  const handleReactivateAccount = (id) => {
    // En una aplicación real, aquí se enviaría una solicitud al backend para reactivar la cuenta
    setInactiveAccounts(inactiveAccounts.filter(account => account.id !== id));
  };

  const handleDeleteAccount = (id) => {
    // En una aplicación real, aquí se enviaría una solicitud al backend para eliminar la cuenta
    setInactiveAccounts(inactiveAccounts.filter(account => account.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Cuentas Inactivas</h2>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Email</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Última Actividad</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
            {inactiveAccounts.map((account) => (
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
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                  <button
                    onClick={() => handleReactivateAccount(account.id)}
                    className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-4"
                  >
                    <RefreshCw className="tw-w-5 tw-h-5" />
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
  );
};

export default InactiveAccountsView;

