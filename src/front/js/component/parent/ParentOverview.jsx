import React, { useEffect, useContext, useState } from "react"
import { Users, Activity, CreditCard, Video } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentOverview = () => {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOverviewData = async () => {
      await Promise.all([
        actions.fetchParentChildren(),
        actions.fetchParentActivities(),
        actions.fetchParentPayments(),
        actions.fetchParentVirtualClasses()

      ])
      setIsLoading(false)
    }
    loadOverviewData()
  }, [store,actions.fetchParentData])

  useEffect(() => {
    actions.fetchParentData()
  }, [])

  if (isLoading) {
    return <div>Loading overview...</div>
  }

  const stats = [
    { title: "Hijos Inscritos", value: store.parentChildren.length, icon: Users, color: "tw-bg-blue-500" },
    { title: "Actividades Próximas", value: store.parentActivities.length, icon: Activity, color: "tw-bg-green-500" },
    {
      title: "Pagos Pendientes",
      value: store.parentPayments.filter((p) => p.status === "Pendiente").length,
      icon: CreditCard,
      color: "tw-bg-yellow-500",
    },
    { title: "Clases Virtuales", value: store.parentVirtualClasses.length, icon: Video, color: "tw-bg-purple-500" },
  ]
  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Parent Summary</h3>
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
        <h4 className="tw-text-lg tw-font-semibold tw-mb-4">Recent Activities</h4>
        <ul className="tw-space-y-2">
          {store.parentActivities.slice(0, 3).map((activity, index) => (
            <li key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
              <p className="tw-font-semibold">{activity.name}</p>
              <p className="tw-text-sm tw-text-gray-600">
                {activity.date} - {activity.time}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ParentOverview

