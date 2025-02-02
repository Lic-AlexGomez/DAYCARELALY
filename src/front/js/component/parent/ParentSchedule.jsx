import React,{ useEffect, useContext, useState } from "react"
import { Clock } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentSchedule = () => {
  const { store, actions } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSchedule = async () => {
      await actions.fetchParentSchedule()
      setIsLoading(false)
    }
    loadSchedule()
  }, [actions.fetchParentSchedule])

  if (isLoading) {
    return <div>Loading schedule...</div>
  }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Horario Semanal</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-5 tw-gap-4">
        {store.parentSchedule.map((day) => (
          <div key={day.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{day.day}</h4>
            <ul className="tw-space-y-2">
              {day.activities.map((activity, index) => (
                <li key={index} className="tw-flex tw-items-center">
                  <Clock className="tw-w-4 tw-h-4 tw-mr-2 tw-text-gray-500" />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentSchedule

