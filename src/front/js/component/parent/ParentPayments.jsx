import React, { useContext, useState, useEffect } from "react";
import { DollarSign, Calendar } from "lucide-react";
import { Context } from "../../store/appContext";
import PayPalButton from "../PayPalButton";

const ParentPayments = () => {
  const { store, actions } = useContext(Context);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  
  useEffect(() => {
    actions.fetchEnrolledClasses();
  }, [actions]);
  
  useEffect(() => {
    setFilteredClasses(
      Array.isArray(store.enrolledClasses)
        ? store.enrolledClasses.filter((payment) => payment.status !== "Paid")
        : []
    );
  }, [store.enrolledClasses]);

  const handlePaymentSelection = (payment) => {
    const isSelected = selectedPayments.some((p) => p.id === payment.id);
    const newSelectedPayments = isSelected
      ? selectedPayments.filter((p) => p.id !== payment.id)
      : [...selectedPayments, payment];

    setSelectedPayments(newSelectedPayments);
    setTotalAmount(newSelectedPayments.reduce((sum, p) => sum + (p.price || 0), 0));
  };

  const isPaymentDisabled = (paymentId) => {
    const ts = localStorage.getItem(`paymentTimestamp_${paymentId}`);
    if (ts) {
      const diff = Date.now() - parseInt(ts, 10);
      // Disable for 30 days in production
      return diff < 30 * 24 * 60 * 60 * 1000;
      // For testing, disable only for 7 seconds
      //return diff < 7000;
    }
    return false;
  };

  const getNextPaymentDate = (paymentId) => {
    const ts = localStorage.getItem(`paymentTimestamp_${paymentId}`);
    if (ts) {
      const nextTimestamp = parseInt(ts, 10) + 30 * 24 * 60 * 60 * 1000;
      return new Date(nextTimestamp).toLocaleDateString();
    }
    return null;
  };

  const handlePaymentSuccess = async (order) => {
    if (!store.user) {
      console.error("No logged-in user");
      return;
    }
    const paymentsData = selectedPayments.map((payment) => ({
      user_id: store.user.parent_id || store.user.id,
      amount: payment.price,
      concept: "Monthly Payment",
      status: "Paid",  // Changed to "Paid"
      due_date: new Date().toISOString().split("T")[0],
      paypal_order_id: order.id,
      payer_email: order.payer.email_address,
      class_id: payment.id,
    }));

    try {
      const response = await fetch(process.env.BACKEND_URL + "api/parent_payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentsData),
      });

      if (!response.ok)
        throw new Error(`Request error: ${response.statusText}`);

      const data = await response.json();
      console.log("Payments saved in the backend:", data);
      selectedPayments.forEach((payment) => {
        localStorage.setItem(`paymentTimestamp_${payment.id}`, Date.now().toString());
      });
      actions.fetchEnrolledClasses();
      setFilteredClasses((prevClasses) =>
        prevClasses.filter((payment) => !selectedPayments.some((p) => p.id === payment.id))
      );
      setSelectedPayments([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error saving payments:", error);
    }
  };

  return (
    <div className="tw-p-6">
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Pending Payments</h3>
      <div className="tw-space-y-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((payment) => {
            const disabled = isPaymentDisabled(payment.id);
            const isSelected = selectedPayments.some((p) => p.id === payment.id);
            const expirationDate = (() => {
              const ts = localStorage.getItem(`paymentTimestamp_${payment.id}`);
              if (ts) {
                const nextTimestamp = parseInt(ts, 10) + 30 * 24 * 60 * 60 * 1000;
                return new Date(nextTimestamp + 6 * 24 * 60 * 60 * 1000);
              }
              return null;
            })();
            const nextPaymentDate = getNextPaymentDate(payment.id);

            return (
              <div key={payment.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                  <h4 className="tw-text-lg tw-font-semibold">{payment.name}</h4>
                  <span
                    className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${payment.status === "Paid"
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
                {nextPaymentDate && (
                  <div className="tw-flex tw-items-center tw-mb-4">
                    <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                    <span>
                      Next Payment: {nextPaymentDate}
                    </span>
                  </div>
                )}
                {expirationDate && (
                  <div className="tw-flex tw-items-center tw-mb-4">
                    <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                    <span>
                      Due Date: {expirationDate.toLocaleDateString()}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handlePaymentSelection(payment)}
                  disabled={disabled}
                  className={`tw-px-4 tw-py-2 tw-rounded tw-text-white ${disabled
                    ? "tw-bg-gray-500 tw-cursor-not-allowed"
                    : isSelected
                      ? "tw-bg-blue-700"
                      : "tw-bg-blue-500"
                    }`}
                >
                  {disabled ? "Recently Paid" : isSelected ? "Unmark" : "Pay"}
                </button>
              </div>
            );
          })
        ) : (
          <p>No pending payments.</p>
        )}
      </div>

      {totalAmount > 0 && (
        <div className="tw-mt-6 tw-text-xl">
          <h4 className="tw-font-semibold">Total Selected: ${totalAmount}</h4>
        </div>
      )}
      {totalAmount > 0 && (
        <div className="tw-mt-4">
          <PayPalButton amount={totalAmount} onSuccess={handlePaymentSuccess} />
        </div>
      )}
    </div>
  );
};

export default ParentPayments;
