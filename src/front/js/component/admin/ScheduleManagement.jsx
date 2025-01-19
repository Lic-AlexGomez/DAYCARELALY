import React, { useState } from 'react';

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

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Gestión de Horarios</h2>
      <form onSubmit={handleAddSchedule} className="tw-mb-4">
        <div className="tw-flex tw-gap-2">
          <select
            name="day"
            value={newSchedule.day}
            onChange={handleInputChange}
            className="tw-border tw-rounded tw-px-2 tw-py-1"
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
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="time"
            name="endTime"
            value={newSchedule.endTime}
            onChange={handleInputChange}
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="text"
            name="activity"
            value={newSchedule.activity}
            onChange={handleInputChange}
            placeholder="Actividad"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
            Agregar Horario
          </button>
        </div>
      </form>
      <table className="tw-w-full tw-border-collapse tw-border tw-border-gray-300">
        <thead>
          <tr className="tw-bg-gray-100">
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Día</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Hora de Inicio</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Hora de Fin</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Actividad</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{schedule.day}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{schedule.startTime}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{schedule.endTime}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{schedule.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleManagement;
