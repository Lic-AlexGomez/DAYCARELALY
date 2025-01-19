import React, { useState } from 'react';

const ClassesView = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: 'Clase de Arte', teacher: 'Ana Gómez', capacity: 15, schedule: 'Lunes y Miércoles 10:00-11:30' },
    { id: 2, name: 'Clase de Música', teacher: 'Carlos Ruiz', capacity: 12, schedule: 'Martes y Jueves 14:00-15:30' },
    { id: 3, name: 'Clase de Baile', teacher: 'Laura Sánchez', capacity: 20, schedule: 'Viernes 16:00-17:30' },
  ]);

  const [newClass, setNewClass] = useState({ name: '', teacher: '', capacity: '', schedule: '' });

  const handleInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    setClasses([...classes, { id: classes.length + 1, ...newClass }]);
    setNewClass({ name: '', teacher: '', capacity: '', schedule: '' });
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Gestión de Clases</h2>
      <form onSubmit={handleAddClass} className="tw-mb-4">
        <div className="tw-flex tw-gap-2">
          <input
            type="text"
            name="name"
            value={newClass.name}
            onChange={handleInputChange}
            placeholder="Nombre de la clase"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="text"
            name="teacher"
            value={newClass.teacher}
            onChange={handleInputChange}
            placeholder="Profesor"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="number"
            name="capacity"
            value={newClass.capacity}
            onChange={handleInputChange}
            placeholder="Capacidad"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="text"
            name="schedule"
            value={newClass.schedule}
            onChange={handleInputChange}
            placeholder="Horario"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
            Agregar Clase
          </button>
        </div>
      </form>
      <table className="tw-w-full tw-border-collapse tw-border tw-border-gray-300">
        <thead>
          <tr className="tw-bg-gray-100">
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Nombre</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Profesor</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Capacidad</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Horario</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{classItem.name}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{classItem.teacher}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{classItem.capacity}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{classItem.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassesView;
