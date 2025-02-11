import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

const PaymentHistory = () => {
  const { store } = useContext(Context);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    if (!store.user) {
      console.log("User not defined in the store.");
      return;
    }

    const userId = store.user.id;
    console.log("User ID obtained:", userId);

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/parent_payments/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error fetching payment history");

        const data = await response.json();
        console.log("Data received from backend:", data);
        setPaymentHistory(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPaymentHistory();
  }, [store.user, store.token]);

  return (
    <div>
      <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Payment History</h2>

      {paymentHistory.length === 0 ? (
        <p>No payments recorded.</p>
      ) : (
        <table className="tw-w-full tw-table-auto tw-border-collapse">
          <thead>
            <tr>
              <th className="tw-border-b tw-py-2 tw-text-left">Concept</th>
              <th className="tw-border-b tw-py-2 tw-text-left">Amount</th>
              <th className="tw-border-b tw-py-2 tw-text-left">Payment Date</th>
              <th className="tw-border-b tw-py-2 tw-text-left">PayPal Order ID</th>
              <th className="tw-border-b tw-py-2 tw-text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id}>
                <td className="tw-border-b tw-py-2">{payment.concept}</td>
                <td className="tw-border-b tw-py-2">${payment.amount}</td>
                <td className="tw-border-b tw-py-2">{payment.due_date}</td>
                <td className="tw-border-b tw-py-2">{payment.paypal_order_id}</td>
                <td className="tw-border-b tw-py-2">
                  <span
                    className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${
                      payment.status === "Paid"
                        ? "tw-bg-green-100 tw-text-green-800"
                        : "tw-bg-yellow-100 tw-text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
