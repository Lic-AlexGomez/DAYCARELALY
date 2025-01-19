import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

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

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(classItem => classItem.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Clases</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddClass} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="name"
            value={newClass.name}
            onChange={handleInputChange}
            placeholder="Nombre de la clase"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="teacher"
            value={newClass.teacher}
            onChange={handleInputChange}
            placeholder="Profesor"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="number"
            name="capacity"
            value={newClass.capacity}
            onChange={handleInputChange}
            placeholder="Capacidad"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="schedule"
            value={newClass.schedule}
            onChange={handleInputChange}
            placeholder="Horario"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Clase
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Profesor</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Capacidad</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Horario</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.teacher}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.capacity}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.schedule}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteClass(classItem.id)}>
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

export default ClassesView;

