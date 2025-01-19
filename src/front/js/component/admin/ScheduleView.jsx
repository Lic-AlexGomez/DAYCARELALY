import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const ScheduleView = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Clase de Arte', start: '09:00', end: '10:30', day: 'Lunes' },
    { id: 2, title: 'Hora del Cuento', start: '11:00', end: '12:00', day: 'Martes' },
    { id: 3, title: 'Juegos al Aire Libre', start: '14:00', end: '15:30', day: 'Miércoles' },
  ]);

  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', day: '' });

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { id: events.length + 1, ...newEvent }]);
    setNewEvent({ title: '', start: '', end: '', day: '' });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Programación</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddEvent} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            placeholder="Título del evento"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="time"
            name="start"
            value={newEvent.start}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="time"
            name="end"
            value={newEvent.end}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <select
            name="day"
            value={newEvent.day}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          >
            <option value="">Seleccionar día</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Evento
          </button>
        </form>
      </div>
      <div className="tw-grid tw-grid-cols-5 tw-gap-4">
        {days.map(day => (
          <div key={day} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">{day}</h3>
            {events
              .filter(event => event.day === day)
              .sort((a, b) => a.start.localeCompare(b.start))
              .map(event => (
                <div key={event.id} className="tw-mb-2 tw-p-2 tw-bg-gray-100 tw-rounded">
                  <div className="tw-flex tw-justify-between tw-items-center">
                    <span className="tw-font-medium">{event.title}</span>
                    <button onClick={() => handleDeleteEvent(event.id)} className="tw-text-red-500">
                      <Trash className="tw-w-4 tw-h-4" />
                    </button>
                  </div>
                  <div className="tw-text-sm tw-text-gray-600">
                    {event.start} - {event.end}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleView;

