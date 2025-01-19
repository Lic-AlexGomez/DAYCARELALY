import React, { useState } from 'react';
import { Save } from 'lucide-react';

const SettingsView = () => {
  const [settings, setSettings] = useState({
    daycareName: 'Kiddy Rainbow Slime Co.',
    email: 'info@kiddyrainbowslime.com',
    phone: '(123) 456-7890',
    address: '123 Rainbow Lane, Colorful City, 12345',
    openingHours: '8:00 AM - 6:00 PM',
    maxCapacity: 50,
    theme: 'light',
  });

  const handleInputChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios en el backend
    alert('Configuración guardada exitosamente');
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Configuración</h2>
      <form onSubmit={handleSubmit} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
        <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
          <div>
            <label htmlFor="daycareName" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Nombre de la Guardería
            </label>
            <input
              type="text"
              id="daycareName"
              name="daycareName"
              value={settings.daycareName}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={settings.phone}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="openingHours" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Horario de Atención
            </label>
            <input
              type="text"
              id="openingHours"
              name="openingHours"
              value={settings.openingHours}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="maxCapacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Capacidad Máxima
            </label>
            <input
              type="number"
              id="maxCapacity"
              name="maxCapacity"
              value={settings.maxCapacity}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            />
          </div>
          <div>
            <label htmlFor="theme" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
              Tema
            </label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
        </div>
        <div className="tw-mt-6">
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Save className="tw-w-5 tw-h-5 tw-mr-2" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;

