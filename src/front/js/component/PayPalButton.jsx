import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton() {
  const parentId = 2; // ⚡ ID estático de prueba
  const clientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: "50.00" } }],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log("Datos recibidos de PayPal:", order);

          const paymentData = {
            parent_id: parentId, // 🔹 Sigue siendo estático
            amount: order.purchase_units[0].amount.value,
            concept: "Pago Mensualidad",
            status: "Completado",
            due_date: new Date().toISOString().split("T")[0],
            paypal_order_id: order.id,
            payer_email: order.payer.email_address,
          };

          console.log("Datos estructurados para el backend:", paymentData);

          try {
            const response = await fetch(process.env.BACKEND_URL +'api/parent_payments', {
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
        }}
      />
    </PayPalScriptProvider>
  );
}