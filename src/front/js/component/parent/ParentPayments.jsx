import React, { useEffect, useContext, useState } from "react"
import { DollarSign, Calendar } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentPayments = () => {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPayments = async () => {
      await actions.fetchParentPayments()
      setIsLoading(false)
    }
    loadPayments()
  }, [])

  if (isLoading) {
    return <div>Loading payments...</div>
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Pagos</h3>
      <div className="tw-space-y-4">
        {store.parentPayments.map((payment) => (
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
            <div className="tw-flex tw-items-center">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>Fecha límite: {payment.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentPayments

