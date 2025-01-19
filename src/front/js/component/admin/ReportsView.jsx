import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

const ReportsView = () => {
  const reports = [
    { id: 1, name: 'Informe de Ingresos', description: 'Resumen de ingresos mensuales' },
    { id: 2, name: 'Informe de Asistencia', description: 'Registro de asistencia de estudiantes' },
    { id: 3, name: 'Informe de Rendimiento', description: 'Evaluación del rendimiento de los estudiantes' },
  ];

  const data = [
    { name: 'Ene', ingresos: 4000, gastos: 2400 },
    { name: 'Feb', ingresos: 3000, gastos: 1398 },
    { name: 'Mar', ingresos: 2000, gastos: 9800 },
    { name: 'Abr', ingresos: 2780, gastos: 3908 },
    { name: 'May', ingresos: 1890, gastos: 4800 },
    { name: 'Jun', ingresos: 2390, gastos: 3800 },
  ];

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Informes</h2>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-6 tw-mb-8">
        {reports.map((report) => (
          <div key={report.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{report.name}</h3>
            <p className="tw-text-gray-600 tw-mb-4">{report.description}</p>
            <button className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
              <Download className="tw-w-5 tw-h-5 tw-mr-2" />
              Generar Informe
            </button>
          </div>
        ))}
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
        <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Ingresos vs Gastos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ingresos" fill="#8884d8" />
            <Bar dataKey="gastos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsView;

