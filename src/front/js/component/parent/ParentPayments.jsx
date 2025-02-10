import React, { useContext, useState, useEffect } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Context } from "../../store/appContext";
import PayPalButton from "../PayPalButton";

const ParentPayments = () => {
  const { store, actions } = useContext(Context);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]); // Estado para clases filtradas localmente

  useEffect(() => {
    // Al montar el componente, obtenemos las clases enroladas
    actions.fetchEnrolledClasses();
  }, []);

  useEffect(() => {
    // Crear una copia de las clases y filtrarlas para mostrar solo las pendientes
    setFilteredClasses(
      Array.isArray(store.enrolledClasses)
        ? store.enrolledClasses.filter((payment) => payment.status !== "Pagado")
        : []
    );
  }, [store.enrolledClasses]); // Este efecto se ejecuta cuando cambian las clases enroladas

  const handlePaymentSelection = (payment) => {
    const isSelected = selectedPayments.some((p) => p.id === payment.id);
    let newSelectedPayments = isSelected
      ? selectedPayments.filter((p) => p.id !== payment.id)
      : [...selectedPayments, payment];

    setSelectedPayments(newSelectedPayments);
    setTotalAmount(newSelectedPayments.reduce((sum, p) => sum + (p.price || 0), 0));
  };

  const handlePaymentSuccess = async (order) => {
    if (!store.user) {
      console.error("No hay usuario logueado");
      return;
    }

    const paymentData = {
      user_id: store.user.id,
      amount: order.purchase_units[0].amount.value,
      concept: "Monthly Payment",
      status: "Pagado",
      due_date: new Date().toISOString().split("T")[0],
      paypal_order_id: order.id,
      payer_email: order.payer.email_address,
      class_id: selectedPayments[0].id, // ID de la clase que se está pagando
    };

    try {
      const response = await fetch(process.env.BACKEND_URL + "api/parent_payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();
      console.log("Pago guardado en el backend:", data);

      // Actualiza las clases pagadas en el frontend
      actions.fetchEnrolledClasses();

      // Filtramos las clases pagadas y las eliminamos de la lista de clases pendientes
      setFilteredClasses((prevClasses) =>
        prevClasses.filter((payment) => payment.id !== selectedPayments[0].id)
      );

      setSelectedPayments([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error al guardar pago:", error);
    }
  };

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Pending payments</h3>
      <div className="tw-space-y-4">
        <h4 className="tw-text-lg tw-font-semibold">Pendientes</h4>
        {filteredClasses.length > 0 ? (
          filteredClasses.map((payment) => (
            <div key={payment.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                <h4 className="tw-text-lg tw-font-semibold">{payment.name}</h4>
                <span
                  className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${
                    payment.status === "Pagado"
                      ? "tw-bg-green-100 tw-text-green-800"
                      : "tw-bg-yellow-100 tw-text-yellow-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-mb-2">
                <DollarSign className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                <span>${payment.price}</span>
              </div>
              <div className="tw-flex tw-items-center tw-mb-4">
                <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                <span>Fecha límite: {new Date(payment.due_date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => handlePaymentSelection(payment)}
                className={`tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded ${
                  selectedPayments.some((p) => p.id === payment.id)
                    ? "tw-bg-blue-700"
                    : ""
                }`}
              >
                {selectedPayments.some((p) => p.id === payment.id) ? "Desmarcar" : "Seleccionar"}
              </button>
            </div>
          ))
        ) : (
          <p>No hay pagos pendientes.</p>
        )}
      </div>

      {totalAmount > 0 && (
        <div className="tw-mt-6 tw-text-xl">
          <h4 className="tw-font-semibold">Total seleccionado: ${totalAmount}</h4>
        </div>
      )}
      {totalAmount > 0 && (
        <PayPalButton amount={totalAmount} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default ParentPayments;
