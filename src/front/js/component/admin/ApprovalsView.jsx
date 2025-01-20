import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const ApprovalsView = () => {
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Inscripción', name: 'Ana Martínez', details: 'Solicitud de inscripción para el programa de verano', status: 'pending',date: '2025-10-01' },
    { id: 2, type: 'Cambio de Horario', name: 'Luis Sánchez', details: 'Solicitud de cambio de horario de tarde a mañana', status: 'pending', date: '2025-10-01' },
    { id: 3, type: 'Actividad Especial', name: 'Sofía Rodríguez', details: 'Propuesta de actividad de pintura al aire libre', status: 'pending', date: '2025-10-01' },
  ]);

  const handleApprove = (id) => {
    setApprovals(approvals.map(approval => 
      approval.id === id ? { ...approval, status: 'approved' } : approval
    ));
  };

  const handleReject = (id) => {
    setApprovals(approvals.map(approval => 
      approval.id === id ? { ...approval, status: 'rejected' } : approval
    ));
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Aprobaciones</h2>
      <div className="tw-space-y-4">
        {approvals.map((approval) => (
          <div key={approval.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-start">
              <div>
                <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{approval.type}</h3>
                <p className="tw-text-gray-600 tw-mb-1">Solicitante: {approval.name}</p>
                <p className="tw-text-gray-600 tw-mb-4">{approval.details}</p>
                <div className="tw-text-gray-500 tw-text-sm">Fecha de solicitud: {approval.date}</div>
              </div>
              <div className="tw-flex tw-space-x-2">
                {approval.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(approval.id)}
                      className="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
                    >
                      <CheckCircle className="tw-w-5 tw-h-5 tw-mr-2" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(approval.id)}
                      className="tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
                    >
                      <XCircle className="tw-w-5 tw-h-5 tw-mr-2" />
                      Rechazar
                    </button>
                  </>
                )}
                {approval.status === 'approved' && (
                  <span className="tw-bg-green-100 tw-text-green-800 tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
                    Aprobado
                  </span>
                )}
                {approval.status === 'rejected' && (
                  <span className="tw-bg-red-100 tw-text-red-800 tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
                    Rechazado
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalsView;

