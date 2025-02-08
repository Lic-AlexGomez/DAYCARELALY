import React, { useState } from "react"
import { Calendar, Clock } from "lucide-react"

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState([
    { id: 1, day: "Monday", time: "09:00 - 10:30", class: "Art Class" },
    { id: 2, day: "Tuesday", time: "11:00 - 12:30", class: "Music Class" },
    { id: 3, day: "Wednesday", time: "09:00 - 10:30", class: "Art Class" },
    { id: 4, day: "Thursday", time: "11:00 - 12:30", class: "Music Class" },
    { id: 5, day: "Friday", time: "14:00 - 15:30", class: "Dance Class" },
  ])

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">My Schedule</h3>
      <div className="tw-grid tw-grid-cols-5 tw-gap-4">
        {days.map((day) => (
          <div key={day} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{day}</h4>
            {schedule
              .filter((item) => item.day === day)
              .map((item) => (
                <div key={item.id} className="tw-mb-2 tw-p-2 tw-bg-gray-100 tw-rounded">
                  <div className="tw-flex tw-items-center tw-mb-1">
                    <Clock className="tw-w-4 tw-h-4 tw-mr-2 tw-text-gray-600" />
                    <span className="tw-text-sm tw-text-gray-600">{item.time}</span>
                  </div>
                  <p className="tw-font-medium">{item.class}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherSchedule

