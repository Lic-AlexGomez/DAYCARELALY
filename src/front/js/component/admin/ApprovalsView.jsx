import React, { useEffect, useContext } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Context } from "../../store/appContext";
import { toast } from "react-toastify";

const ApprovalsView = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Cargar aprobaciones al montar el componente
    actions.fetchApprovals();
  }, []);

  const handleApprove = async (id) => {
    const result = await actions.updateApprovalStatus(id, "approved");
    if (result.success) {
      toast.success("Aprobación actualizada con éxito");
    } else {
      toast.error(`Error al aprobar: ${result.error}`);
    }
  };

  const handleReject = async (id) => {
    const result = await actions.updateApprovalStatus(id, "rejected");
    if (result.success) {
      toast.success("Rechazo actualizado con éxito");
    } else {
      toast.error(`Error al rechazar: ${result.error}`);
    }
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Aprobaciones</h2>
      <div className="tw-space-y-4">
        {store.approvals.map((approval) => (
          <div key={approval.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-start">
              <div>
                <h3 className="tw-text-lg tw-font-semibold tw-mb-2">{approval.type}</h3>
                <p className="tw-text-gray-600 tw-mb-1">Solicitante: {approval.name}</p>
                <p className="tw-text-gray-600 tw-mb-4">{approval.details}</p>
                <div className="tw-text-gray-500 tw-text-sm">
                  Fecha de solicitud: {approval.date}
                </div>
              </div>
              <div className="tw-flex tw-space-x-2">
                {approval.status === "pending" && (
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
                {approval.status === "approved" && (
                  <span className="tw-bg-green-100 tw-text-green-800 tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold">
                    Aprobado
                  </span>
                )}
                {approval.status === "rejected" && (
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
