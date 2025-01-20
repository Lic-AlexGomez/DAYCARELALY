import React, { useState } from "react"
import { Plus, Edit, Trash, List, Search, Calendar } from "lucide-react"

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

const ScheduleManagementPage = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      class: "Arte y Creatividad",
      teacher: "María García",
      dayOfWeek: "Lunes",
      startTime: "09:00",
      endTime: "10:30",
      capacity: 15,
      enrolled: 12,
    },
    {
      id: 2,
      class: "Música y Movimiento",
      teacher: "Juan Pérez",
      dayOfWeek: "Martes",
      startTime: "11:00",
      endTime: "12:30",
      capacity: 20,
      enrolled: 18,
    },
    {
      id: 3,
      class: "Juegos Educativos",
      teacher: "Ana Rodríguez",
      dayOfWeek: "Miércoles",
      startTime: "14:00",
      endTime: "15:30",
      capacity: 12,
      enrolled: 10,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDay, setSelectedDay] = useState("all")
  const [newSchedule, setNewSchedule] = useState({
    class: "",
    teacher: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    capacity: "",
    enrolled: 0,
  })

  const filteredSchedules = schedules.filter(
    (schedule) =>
      (selectedDay === "all" || schedule.dayOfWeek === selectedDay) &&
      (schedule.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.teacher.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleInputChange = (e) => {
    setNewSchedule({ ...newSchedule, [e.target.name]: e.target.value })
  }

  const handleAddSchedule = (e) => {
    e.preventDefault()
    setSchedules([...schedules, { id: schedules.length + 1, ...newSchedule }])
    setNewSchedule({
      class: "",
      teacher: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      capacity: "",
      enrolled: 0,
    })
  }

  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  return (
    <div className="tw-flex tw-h-screen tw-overflow-hidden">
      <div className="tw-flex-1 tw-overflow-auto">
        <Header />
        <main className="tw-p-6">
          <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
            <PageTitle />
            <SearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
            <AddScheduleForm
              newSchedule={newSchedule}
              handleInputChange={handleInputChange}
              handleAddSchedule={handleAddSchedule}
            />
            <SchedulesTable filteredSchedules={filteredSchedules} handleDeleteSchedule={handleDeleteSchedule} />
          </div>
        </main>
      </div>
    </div>
  )
}



const Header = () => (
  <header className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
    <h1 className="tw-text-2xl tw-font-bold">Gestión de Horarios</h1>
    <div className="tw-flex tw-items-center">
      <span className="tw-mr-2">Usuario</span>
      <div className="tw-w-8 tw-h-8 tw-bg-gray-300 tw-rounded-full"></div>
    </div>
  </header>
)

const PageTitle = () => (
  <div className="tw-mb-6">
    <h2 className="tw-text-xl tw-font-semibold tw-mb-2">Horarios de Clases</h2>
    <p className="tw-text-gray-600">Administrar horarios y asignaciones</p>
  </div>
)

const SearchAndFilter = ({ searchTerm, setSearchTerm, selectedDay, setSelectedDay }) => (
  <div className="tw-mb-4 tw-flex tw-justify-between">
    <div className="tw-relative">
      <input
        type="text"
        placeholder="Buscar clases..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="tw-border tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-w-64"
      />
      <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400 tw-w-5 tw-h-5" />
    </div>
    <div className="tw-relative">
      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
        className="tw-border tw-rounded-md tw-pl-10 tw-pr-3 tw-py-2 tw-w-48 tw-appearance-none"
      >
        <option value="all">Todos los días</option>
        {daysOfWeek.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      <Calendar className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400 tw-w-5 tw-h-5" />
    </div>
  </div>
)

const AddScheduleForm = ({ newSchedule, handleInputChange, handleAddSchedule }) => (
  <form onSubmit={handleAddSchedule} className="tw-mb-6 tw-grid tw-grid-cols-7 tw-gap-4">
    <input
      name="class"
      value={newSchedule.class}
      onChange={handleInputChange}
      placeholder="Clase"
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    />
    <input
      name="teacher"
      value={newSchedule.teacher}
      onChange={handleInputChange}
      placeholder="Profesor"
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    />
    <select
      name="dayOfWeek"
      value={newSchedule.dayOfWeek}
      onChange={handleInputChange}
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    >
      <option value="">Seleccionar día</option>
      {daysOfWeek.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
    <input
      type="time"
      name="startTime"
      value={newSchedule.startTime}
      onChange={handleInputChange}
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    />
    <input
      type="time"
      name="endTime"
      value={newSchedule.endTime}
      onChange={handleInputChange}
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    />
    <input
      name="capacity"
      type="number"
      value={newSchedule.capacity}
      onChange={handleInputChange}
      placeholder="Capacidad"
      required
      className="tw-border tw-rounded-md tw-px-3 tw-py-2"
    />
    <button
      type="submit"
      className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center hover:tw-bg-blue-600"
    >
      <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
      Agregar Horario
    </button>
  </form>
)

const SchedulesTable = ({ filteredSchedules, handleDeleteSchedule }) => (
  <table className="tw-w-full">
    <thead className="tw-bg-gray-50">
      <tr>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Clase
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Profesor
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Día
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Horario
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Capacidad
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Inscritos
        </th>
        <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
      {filteredSchedules.map((schedule) => (
        <tr key={schedule.id}>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.class}</td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.teacher}</td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.dayOfWeek}</td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{`${schedule.startTime} - ${schedule.endTime}`}</td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{schedule.capacity}</td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
            <span
              className={`tw-px-2 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full ${
                schedule.enrolled >= schedule.capacity
                  ? "tw-bg-red-100 tw-text-red-800"
                  : "tw-bg-green-100 tw-text-green-800"
              }`}
            >
              {schedule.enrolled}/{schedule.capacity}
            </span>
          </td>
          <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
            <button className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2">
              <Edit className="tw-w-5 tw-h-5" />
            </button>
            <button className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2">
              <List className="tw-w-5 tw-h-5" />
            </button>
            <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteSchedule(schedule.id)}>
              <Trash className="tw-w-5 tw-h-5" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default ScheduleManagementPage

