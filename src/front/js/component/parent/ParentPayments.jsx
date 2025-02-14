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
  }, []);
  const getPaymentKey = (payment) => {
    return `paymentTimestamp_${payment.class.id}_${payment.child_name}`;
  };
  useEffect(() => {
    if (Array.isArray(store.enrolledClasses)) {
      const uniquePayments = {};
      store.enrolledClasses.forEach((payment) => {
        const key = getPaymentKey(payment);
        if (!uniquePayments[key]) {
          uniquePayments[key] = payment;
        }
      });
      const deduped = Object.values(uniquePayments);
      setFilteredClasses(
        deduped.filter((payment) => payment.class.status !== "Paid")
      );
    } else {
      setFilteredClasses([]);
    }
  }, [store.enrolledClasses]);

  const handlePaymentSelection = (payment) => {
    const isSelected = selectedPayments.some(
      (p) =>
        p.class.id === payment.class.id && p.child_name === payment.child_name
    );
    const newSelectedPayments = isSelected
      ? selectedPayments.filter(
          (p) =>
            !(
              p.class.id === payment.class.id &&
              p.child_name === payment.child_name
            )
        )
      : [...selectedPayments, payment];

    setSelectedPayments(newSelectedPayments);
    setTotalAmount(
      newSelectedPayments.reduce((sum, p) => sum + (p.class.price || 0), 0)
    );
  };
  const isPaymentDisabled = (payment) => {
    const key = getPaymentKey(payment);
    const ts = localStorage.getItem(key);
    if (ts) {
      const diff = Date.now() - parseInt(ts, 10);
      return diff < 30 * 24 * 60 * 60 * 1000;
    }
    return false;
  };

  const getNextPaymentDate = (payment) => {
    const key = getPaymentKey(payment);
    const ts = localStorage.getItem(key);
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
      child_name: payment.child_name,       
      class_name: payment.class.name,          
      amount: payment.class.price,
      concept: "Monthly Payment",
      status: "Paid",
      due_date: new Date().toISOString().split("T")[0],
      paypal_order_id: order.id,
      payer_email: order.payer.email_address,
      class_id: payment.class.id,
    }));

    try {
      const response = await fetch(
        process.env.BACKEND_URL + "api/parent_payments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentsData),
        }
      );

      if (!response.ok)
        throw new Error(`Request error: ${response.statusText}`);

      const data = await response.json();
      console.log("Payments saved in the backend:", data);
      selectedPayments.forEach((payment) => {
        const key = getPaymentKey(payment);
        localStorage.setItem(key, Date.now().toString());
      });
      actions.fetchEnrolledClasses();
      setFilteredClasses((prevClasses) =>
        prevClasses.filter(
          (payment) =>
            !selectedPayments.some(
              (p) =>
                p.class.id === payment.class.id &&
                p.child_name === payment.child_name
            )
        )
      );
      setSelectedPayments([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error saving payments:", error);
    }
  };

  return (
    <div className="tw-p-6">
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">
        Pending Payments
      </h3>
      <div className="tw-space-y-4">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((payment) => {
            const disabled = isPaymentDisabled(payment);
            const isSelected = selectedPayments.some(
              (p) =>
                p.class.id === payment.class.id &&
                p.child_name === payment.child_name
            );
            const expirationDate = (() => {
              const key = getPaymentKey(payment);
              const ts = localStorage.getItem(key);
              if (ts) {
                const nextTimestamp =
                  parseInt(ts, 10) + 30 * 24 * 60 * 60 * 1000;
                return new Date(
                  nextTimestamp + 6 * 24 * 60 * 60 * 1000
                );
              }
              return null;
            })();
            const nextPaymentDate = getNextPaymentDate(payment);

            return (
              <div
                key={payment.id + "_" + payment.child_name}
                className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6"
              >
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold">
                      {payment.class.name}
                    </h4>
                    {payment.child_name && (
                      <p className="tw-text-sm tw-text-gray-600">
                        Child: {payment.child_name}
                      </p>
                    )}
                  </div>
                  <span
                    className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold ${
                      payment.class.status === "Paid"
                        ? "tw-bg-green-100 tw-text-green-800"
                        : "tw-bg-yellow-100 tw-text-yellow-800"
                    }`}
                  >
                    {payment.class.status}
                  </span>
                </div>
                <div className="tw-flex tw-items-center tw-mb-2">
                  <DollarSign className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                  <span>${payment.class.price}</span>
                </div>
                {nextPaymentDate && (
                  <div className="tw-flex tw-items-center tw-mb-4">
                    <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
                    <span>Next Payment: {nextPaymentDate}</span>
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
                  className={`tw-px-4 tw-py-2 tw-rounded tw-text-white ${
                    disabled
                      ? "tw-bg-gray-500 tw-cursor-not-allowed"
                      : isSelected
                      ? "tw-bg-blue-700"
                      : "tw-bg-blue-500"
                  }`}
                >
                  {disabled
                    ? "Recently Paid"
                    : isSelected
                    ? "Unmark"
                    : "Pay"}
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
