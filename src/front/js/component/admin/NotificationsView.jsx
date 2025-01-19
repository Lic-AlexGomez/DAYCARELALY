import React, { useState } from 'react';
import { Bell, Trash } from 'lucide-react';

const NotificationsView = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Nuevo estudiante registrado', date: '2023-05-27', read: false },
    { id: 2, message: 'Recordatorio: Reunión de padres mañana', date: '2023-05-26', read: true },
    { id: 3, message: 'Actualización del horario de clases', date: '2023-05-25', read: false },
  ]);

  const [newNotification, setNewNotification] = useState('');

  const handleInputChange = (e) => {
    setNewNotification(e.target.value);
  };

  const handleAddNotification = (e) => {
    e.preventDefault();
    setNotifications([...notifications, { id: notifications.length + 1, message: newNotification, date: new Date().toISOString().split('T')[0], read: false }]);
    setNewNotification('');
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Notificaciones</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddNotification} className="tw-flex tw-space-x-4">
          <input
            type="text"
            value={newNotification}
            onChange={handleInputChange}
            placeholder="Nueva notificación"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Bell className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Notificación
          </button>
        </form>
      </div>
      <div className="tw-space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={`tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 ${notification.read ? 'tw-opacity-50' : ''}`}>
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <span className={`tw-font-semibold ${notification.read ? 'tw-text-gray-500' : 'tw-text-blue-600'}`}>
                {notification.read ? 'Leído' : 'No leído'}
              </span>
              <span className="tw-text-sm tw-text-gray-500">{notification.date}</span>
            </div>
            <p className="tw-text-gray-600 tw-mb-4">{notification.message}</p>
            <div className="tw-flex tw-justify-between">
              {!notification.read && (
                <button 
                  className="tw-text-blue-600 hover:tw-text-blue-900"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Marcar como leído
                </button>
              )}
              <button 
                className="tw-text-red-600 hover:tw-text-red-900"
                onClick={() => handleDeleteNotification(notification.id)}
              >
                <Trash className="tw-w-5 tw-h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsView;

