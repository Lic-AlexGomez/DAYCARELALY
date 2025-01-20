import React, { useState } from 'react';
import { Plus, Search, Edit, Trash } from 'lucide-react';

const ClientsView = () => {
  const [clients, setClients] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890", status: "Activo" },
    { id: 2, name: "María García", email: "maria@example.com", phone: "098-765-4321", status: "Inactivo" },
    { id: 3, name: "Carlos Rodríguez", email: "carlos@example.com", phone: "555-555-5555", status: "Activo" },
  ])

  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    setClients([...clients, { id: clients.length + 1, ...newClient }]);
    setNewClient({ name: '', email: '', phone: '' });
  };

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Clientes</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddClient} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="tel"
            name="phone"
            value={newClient.phone}
            onChange={handleInputChange}
            placeholder="Teléfono"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Cliente
          </button>
        </form>
      </div>
      <div className="tw-mb-6">
        <div className="tw-relative">
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pl-10 tw-pr-4 tw-py-2"
          />
          <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
        </div>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">ID</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Email</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Teléfono</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Estado</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.id}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.email}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.phone}</td>
              <td className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              {client.status === "Activo" ? (
                <span className="tw-inline-flex tw-items-center tw-justify-center tw-py-1 tw-px-2 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-green-100 tw-text-green-800">Activo</span>
              ) : (
                <span className="tw-inline-flex tw-items-center tw-justify-center tw-py-1 tw-px-2 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-red-100 tw-text-red-800">Inactivo</span>
              )}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteClient(client.id)}>
                  <Trash className="tw-w-5 tw-h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsView;

