import React, { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { Plus, Trash } from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const SchedulePage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Art Class",
      start: new Date(2025, 0, 20, 9, 0),
      end: new Date(2025, 0, 20, 10, 30),
      day: "Monday",
    },
    {
      id: 2,
      title: "Story Time",
      start: new Date(2025, 0, 4, 11, 0),
      end: new Date(2025, 0, 4, 12, 0),
      day: "Tuesday",
    },
    {
      id: 3,
      title: "Outdoor Games",
      start: new Date(2025, 0, 5, 14, 0),
      end: new Date(2025, 0, 5, 15, 30),
      day: "Wednesday",
    },
  ])

  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", day: "" })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [view, setView] = useState("calendar") 

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value })
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    const startDate = moment(newEvent.start, "HH:mm").toDate()
    const endDate = moment(newEvent.end, "HH:mm").toDate()
    const newEventWithDates = {
      id: events.length + 1,
      ...newEvent,
      start: startDate,
      end: endDate,
    }
    setEvents([...events, newEventWithDates])
    setNewEvent({ title: "", start: "", end: "", day: "" })
  }

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id))
    setSelectedEvent(null)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
  }

  return (
    <div className="tw-p-6">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h1 className="tw-text-2xl tw-font-bold">Programming</h1>
        <button
          onClick={() => setView(view === "calendar" ? "weekly" : "calendar")}
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
        >
          {view === "calendar" ? "Ver Vista Semanal" : "Ver Calendario"}
        </button>
      </div>

      <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Add New Event</h2>
        <form onSubmit={handleAddEvent} className="tw-flex tw-space-x-4">
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            placeholder="Título del evento"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="time"
            name="start"
            value={newEvent.start}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="time"
            name="end"
            value={newEvent.end}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <select
            name="day"
            value={newEvent.day}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          >
            <option value="">Select day</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
          >
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Add Event
          </button>
        </form>
      </div>

      {view === "calendar" ? (
        <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Activities Calendar</h2>
          <div style={{ height: "500px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>
      ) : (
        <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Weekly Schedule</h2>
          <div className="tw-grid tw-grid-cols-5 tw-gap-4">
            {days.map((day) => (
              <div key={day} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
                <h3 className="tw-text-lg tw-font-semibold tw-mb-4">{day}</h3>
                {events
                  .filter((event) => event.day === day)
                  .sort((a, b) => a.start - b.start)
                  .map((event) => (
                    <div key={event.id} className="tw-mb-2 tw-p-2 tw-bg-gray-100 tw-rounded">
                      <div className="tw-flex tw-justify-between tw-items-center">
                        <span className="tw-font-medium">{event.title}</span>
                        <button onClick={() => handleDeleteEvent(event.id)} className="tw-text-red-500">
                          <Trash className="tw-w-4 tw-h-4" />
                        </button>
                      </div>
                      <div className="tw-text-sm tw-text-gray-600">
                        {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mt-6">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Event Details</h2>
          <p>
            <strong>Título:</strong> {selectedEvent.title}
          </p>
          <p>
            <strong>Día:</strong> {selectedEvent.day}
          </p>
          <p>
            <strong>Inicio:</strong> {moment(selectedEvent.start).format("LLLL")}
          </p>
          <p>
            <strong>Fin:</strong> {moment(selectedEvent.end).format("LLLL")}
          </p>
          <div className="tw-mt-4">
            <button className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-mr-2">Edit</button>
            <button
              onClick={() => handleDeleteEvent(selectedEvent.id)}
              className="tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
            >
              Eliminate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchedulePage

