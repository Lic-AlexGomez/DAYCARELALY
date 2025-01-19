import React from 'react';

const ReportsView = () => {
  const reports = [
    { id: 1, name: 'Informe de Ingresos', description: 'Resumen de ingresos mensuales' },
    { id: 2, name: 'Informe de Asistencia', description: 'Registro de asistencia de estudiantes' },
    { id: 3, name: 'Informe de Rendimiento', description: 'Evaluación del rendimiento de los estudiantes' },
  ];

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Informes</h2>
      <div className="tw-grid tw-gap-4 tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report.id} className="tw-border tw-rounded tw-p-4 tw-shadow">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{report.name}</h3>
            <p className="tw-text-gray-600 tw-mb-4">{report.description}</p>
            <button className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
              Generar Informe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsView;
