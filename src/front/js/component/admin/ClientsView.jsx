import React, { useState } from 'react';

const ClientsView = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '123-456-7890' },
    { id: 2, name: 'María García', email: 'maria@example.com', phone: '098-765-4321' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '555-555-5555' },
  ]);

  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    setClients([...clients, { id: clients.length + 1, ...newClient }]);
    setNewClient({ name: '', email: '', phone: '' });
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Gestión de Clientes</h2>
      <form onSubmit={handleAddClient} className="tw-mb-4">
        <div className="tw-flex tw-gap-2">
          <input
            type="text"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="email"
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="tel"
            name="phone"
            value={newClient.phone}
            onChange={handleInputChange}
            placeholder="Teléfono"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
            Agregar Cliente
          </button>
        </div>
      </form>
      <table className="tw-w-full tw-border-collapse tw-border tw-border-gray-300">
        <thead>
          <tr className="tw-bg-gray-100">
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">ID</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Nombre</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Email</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{client.id}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{client.name}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{client.email}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{client.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsView;
