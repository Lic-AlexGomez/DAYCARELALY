import React, { useEffect, useContext, useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Context } from "../../store/appContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ParentPayments = () => {
  const { store, actions } = useContext(Context);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Eliminar el fetch de los pagos para esta vista

  const handlePaymentSelection = (payment) => {
    const isSelected = selectedPayments.some((p) => p.id === payment.id);
    let newSelectedPayments;

    if (isSelected) {
      newSelectedPayments = selectedPayments.filter((p) => p.id !== payment.id);
    } else {
      newSelectedPayments = [...selectedPayments, payment];
    }

    setSelectedPayments(newSelectedPayments);
    const newTotal = newSelectedPayments.reduce((sum, p) => sum + p.amount, 0);
    setTotalAmount(newTotal);
  };

  const handlePaymentSuccess = async (order) => {
    console.log("Pago exitoso:", order);

    const paymentData = {
      parent_id: store.user.id - 1, 
      amount: order.purchase_units[0].amount.value,
      concept: "Pago Mensualidad",
      status: "Completado",
      due_date: new Date().toISOString().split("T")[0],
      paypal_order_id: order.id,
      payer_email: order.payer.email_address,
    };

    console.log("Datos estructurados para el backend:", paymentData);

    try {
      const response = await fetch(process.env.BACKEND_URL + "api/parent_payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();
      console.log("Pago guardado en el backend:", data);
    } catch (error) {
      console.error("Error al guardar pago:", error);
    }
  };
  const testPayment = {
    id: "test",  
    concept: "Pago de prueba",
    status: "Pendiente", 
    amount: 50,
    dueDate: "2025-02-07",
  };

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Pagos pendientes</h3>
      <div className="tw-space-y-4">
        {[testPayment].map((payment) => (
          <div key={payment.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
              <h4 className="tw-text-lg tw-font-semibold">{payment.concept}</h4>
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
              <span>${payment.amount}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-4">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>Fecha límite: {payment.dueDate}</span>
            </div>
            {payment.status !== "Pagado" && (
              <button
                onClick={() => handlePaymentSelection(payment)}
                className={`tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded ${
                  selectedPayments.some((p) => p.id === payment.id)
                    ? "tw-bg-blue-700"
                    : ""
                }`}
              >
                {selectedPayments.some((p) => p.id === payment.id)
                  ? "Desmarcar"
                  : "Seleccionar"}
              </button>
            )}
          </div>
        ))}
      </div>
      {totalAmount > 0 && (
        <div className="tw-mt-6 tw-text-xl">
          <h4 className="tw-font-semibold">Total seleccionado: ${totalAmount}</h4>
        </div>
      )}
      {totalAmount > 0 && (
        <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID }}>
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{ amount: { value: totalAmount.toString() } }], 
              });
            }}
            onApprove={async (data, actions) => {
              const order = await actions.order.capture();
              console.log("Pago realizado con éxito:", order);
              handlePaymentSuccess(order);
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default ParentPayments;
