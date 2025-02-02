import React, { useEffect, useContext, useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentActivities = () => {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      await actions.fetchParentActivities()
      setIsLoading(false)
    }
    loadActivities()
  }, [actions.fetchParentActivities]) // Added actions.fetchParentActivities to dependencies

  if (isLoading) {
    return <div>Loading activities...</div>
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Actividades</h3>
      <div className="tw-space-y-4">
        {store.parentActivities.map((activity) => (
          <div key={activity.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{activity.name}</h4>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{new Date(activity.date).toLocaleDateString()}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Clock className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>
                {activity.time} - Duración: {activity.duration}
              </span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <MapPin className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.location}</span>
            </div>
            <div className="tw-mt-2">
              <span
                className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold
                ${
                  activity.status === "scheduled"
                    ? "tw-bg-blue-100 tw-text-blue-800"
                    : activity.status === "completed"
                      ? "tw-bg-green-100 tw-text-green-800"
                      : "tw-bg-red-100 tw-text-red-800"
                }`}
              >
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentActivities

