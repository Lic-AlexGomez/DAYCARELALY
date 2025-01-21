import React from "react"
import { Calendar, Clock } from "lucide-react"

const ParentSchedule = () => {
  const schedule = [
    { id: 1, day: "Lunes", activities: ["Clase de Arte", "Música", "Juego Libre"] },
    { id: 2, day: "Martes", activities: ["Matemáticas", "Educación Física", "Lectura"] },
    { id: 3, day: "Miércoles", activities: ["Ciencias", "Inglés", "Juego Estructurado"] },
    { id: 4, day: "Jueves", activities: ["Clase de Arte", "Música", "Juego Libre"] },
    { id: 5, day: "Viernes", activities: ["Matemáticas", "Educación Física", "Lectura"] },
  ]

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Horario Semanal</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-5 tw-gap-4">
        {schedule.map((day) => (
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

