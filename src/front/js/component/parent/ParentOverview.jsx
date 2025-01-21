import React from "react"
import { Users, Calendar, Activity, CreditCard } from "lucide-react"

const ParentOverview = () => {
  const stats = [
    { title: "Hijos Inscritos", value: "2", icon: Users, color: "tw-bg-blue-500" },
    { title: "Próximas Actividades", value: "3", icon: Activity, color: "tw-bg-green-500" },
    { title: "Pagos Pendientes", value: "$150", icon: CreditCard, color: "tw-bg-yellow-500" },
    { title: "Días Hasta Vacaciones", value: "15", icon: Calendar, color: "tw-bg-purple-500" },
  ]

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Resumen de Padres</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-4 tw-gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <div className="tw-flex tw-items-center">
              <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
                <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
              </div>
              <div className="tw-ml-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700">{stat.title}</h4>
                <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tw-mt-8">
        <h4 className="tw-text-lg tw-font-semibold tw-mb-4">Actividades Recientes</h4>
        <ul className="tw-space-y-2">
          <li className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <p className="tw-font-semibold">Clase de Arte</p>
            <p className="tw-text-sm tw-text-gray-600">Juan participó en la clase de pintura</p>
          </li>
          <li className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <p className="tw-font-semibold">Pago Mensual</p>
            <p className="tw-text-sm tw-text-gray-600">Se realizó el pago de la mensualidad</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ParentOverview

