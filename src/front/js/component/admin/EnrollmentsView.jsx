import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const EnrollmentsView = () => {
  const [enrollments, setEnrollments] = useState([
    {
      id: 1, studentName: 'Luis Martínez', className: 'Clase de Arte', enrollmentDate: '2023-05-01'
    },
    { id: 2, studentName: 'Ana López', className: 'Clase de Música', enrollmentDate: '2023-05-02' },
    { id: 3, studentName: 'Pedro Ramírez', className: 'Clase de Baile', enrollmentDate: '2023-05-03' },
  ]);

  const [newEnrollment, setNewEnrollment] = useState({ studentName: '', className: '', enrollmentDate: '' });

  const handleInputChange = (e) => {
    setNewEnrollment({ ...newEnrollment, [e.target.name]: e.target.value });
  };

  const handleAddEnrollment = (e) => {
    e.preventDefault();
    setEnrollments([...enrollments, { id: enrollments.length + 1, ...newEnrollment }]);
    setNewEnrollment({ studentName: '', className: '', enrollmentDate: '' });
  };

  const handleDeleteEnrollment = (id) => {
    setEnrollments(enrollments.filter(enrollment => enrollment.id !== id));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Inscripciones</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddEnrollment} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="studentName"
            value={newEnrollment.studentName}
            onChange={handleInputChange}
            placeholder="Nombre del estudiante"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="className"
            value={newEnrollment.className}
            onChange={handleInputChange}
            placeholder="Nombre de la clase"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="date"
            name="enrollmentDate"
            value={newEnrollment.enrollmentDate}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Inscripción
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Estudiante</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Clase</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Fecha de Inscripción</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.studentName}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.className}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.enrollmentDate}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteEnrollment(enrollment.id)}>
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

export default EnrollmentsView;

