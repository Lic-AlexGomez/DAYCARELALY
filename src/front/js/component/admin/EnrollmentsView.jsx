import React, { useState } from 'react';

const EnrollmentsView = () => {
  const [enrollments, setEnrollments] = useState([
    { id: 1, studentName: 'Luis Martínez', className: 'Clase de Arte', enrollmentDate: '2023-05-01' },
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

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Gestión de Inscripciones</h2>
      <form onSubmit={handleAddEnrollment} className="tw-mb-4">
        <div className="tw-flex tw-gap-2">
          <input
            type="text"
            name="studentName"
            value={newEnrollment.studentName}
            onChange={handleInputChange}
            placeholder="Nombre del estudiante"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="text"
            name="className"
            value={newEnrollment.className}
            onChange={handleInputChange}
            placeholder="Nombre de la clase"
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <input
            type="date"
            name="enrollmentDate"
            value={newEnrollment.enrollmentDate}
            onChange={handleInputChange}
            className="tw-border tw-rounded tw-px-2 tw-py-1"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
            Agregar Inscripción
          </button>
        </div>
      </form>
      <table className="tw-w-full tw-border-collapse tw-border tw-border-gray-300">
        <thead>
          <tr className="tw-bg-gray-100">
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Estudiante</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Clase</th>
            <th className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">Fecha de Inscripción</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{enrollment.studentName}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{enrollment.className}</td>
              <td className="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{enrollment.enrollmentDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentsView;
