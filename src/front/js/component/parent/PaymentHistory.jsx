import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";

const PaymentHistory = () => {
  const { store } = useContext(Context);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    if (!store.user) {
      // console.log("User not defined in the store.");
      return;
    }

    const userId = store.user.id;
    // console.log("User ID obtained:", userId);

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
        // console.log("Data received from backend:", data);
        setPaymentHistory(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPaymentHistory();
  }, [store.user, store.token]);

  return (
    <div className="tw-p-6 tw-bg-white tw-shadow-lg tw-rounded-lg">
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4 tw-text-center">Payment History</h2>

      {paymentHistory.length === 0 ? (
        <p className="tw-text-center tw-text-gray-600">No payments recorded.</p>
      ) : (
        <div className="tw-overflow-x-auto">
          <table className="tw-w-full tw-table-auto tw-border tw-rounded-lg">
            <thead className="tw-bg-gray-100">
              <tr className="tw-text-gray-700">
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Child Name</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Class</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Concept</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Amount</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Payment Date</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">PayPal Order ID</th>
                <th className="tw-border-b tw-py-3 tw-px-4 tw-text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="tw-text-gray-800">
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">{payment.child_name}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">{payment.class_name}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">{payment.concept}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">${payment.amount}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">{payment.due_date}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">{payment.paypal_order_id}</td>
                  <td className="tw-border-b tw-py-3 tw-px-4 tw-text-center">
                    <span
                      className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${
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
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
