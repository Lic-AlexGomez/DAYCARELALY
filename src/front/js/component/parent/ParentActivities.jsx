import React from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

const ParentActivities = () => {
  const activities = [
    {
      id: 1,
      name: "Excursión al Zoológico",
      date: "2023-06-15",
      time: "9:00 AM - 2:00 PM",
      location: "Zoológico Municipal",
    },
    { id: 2, name: "Taller de Pintura", date: "2023-06-20", time: "10:00 AM - 12:00 PM", location: "Salón de Arte" },
    { id: 3, name: "Día de Deportes", date: "2023-06-25", time: "9:00 AM - 1:00 PM", location: "Campo Deportivo" },
  ]

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Actividades Próximas</h3>
      <div className="tw-space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{activity.name}</h4>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.date}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Clock className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.time}</span>
            </div>
            <div className="tw-flex tw-items-center">
              <MapPin className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentActivities

