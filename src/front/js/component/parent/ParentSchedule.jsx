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
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Weekly Schedule</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-5 tw-gap-4">
        {console.log(store.enrolledClasses)}
        {store.enrolledClasses.map((schedule) => (
          <div key={schedule.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">Class:</h4> <span>{schedule.name}</span> 
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">Schedule:</h4> <span>{schedule.time}</span> 
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentSchedule

