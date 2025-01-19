import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, day: 'Lunes', startTime: '09:00', endTime: '17:00', activity: 'Clases regulares' },
    { id: 2, day: 'Martes', startTime: '09:00', endTime: '17:00', activity: 'Clases regulares' },
    { id: 3, day: 'Miércoles', startTime: '09:00', endTime: '17:00', activity: 'Clases regulares' },
  ]);

  const [newSchedule, setNewSchedule] = useState({ day: '', startTime: '', endTime: '', activity: '' });

  const handleInputChange = (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    setSchedules([...schedules, { id: schedules.length + 1, ...newSchedule }]);
    setNewSchedule({ day: '', startTime: '', endTime: '', activity: '' });
  };

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Horarios</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddSchedule} className="tw-flex tw-space-x-4">
          <select
            name="day"
            value={newSchedule.day}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          >
            <option value="">Seleccionar día</option>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
          </select>
          <input
            type="time"
            name="startTime"
            value={newSchedule.startTime}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="time"
            name="endTime"
            value={newSchedule.endTime}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="activity"
            value={newSchedule.activity}
            onChange={handleInputChange}
            placeholder="Actividad"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Horario
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Día</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Hora de Inicio</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Hora de Fin</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actividad</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.day}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.startTime}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.endTime}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.activity}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteSchedule(schedule.id)}>
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

export default ScheduleManagement;

