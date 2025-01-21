import React, { useState } from "react"
import { Plus, Edit, Trash, Check } from "lucide-react"

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([
    { id: 1, title: "Dibujo de la familia", class: "Clase de Arte", dueDate: "2023-06-15", status: "Pendiente" },
    { id: 2, title: "Práctica de flauta", class: "Clase de Música", dueDate: "2023-06-20", status: "Completada" },
    { id: 3, title: "Coreografía grupal", class: "Clase de Baile", dueDate: "2023-06-25", status: "Pendiente" },
  ])

  const [newAssignment, setNewAssignment] = useState({ title: "", class: "", dueDate: "" })

  const handleInputChange = (e) => {
    setNewAssignment({
      ...newAssignment,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddAssignment = (e) => {
    e.preventDefault()
    setAssignments([...assignments, { id: assignments.length + 1, ...newAssignment, status: "Pendiente" }])
    setNewAssignment({ title: "", class: "", dueDate: "" })
  }

  const handleToggleStatus = (id) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === id
          ? { ...assignment, status: assignment.status === "Pendiente" ? "Completada" : "Pendiente" }
          : assignment,
      ),
    )
  }

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h3 className="tw-text-xl tw-font-semibold">Tareas</h3>
        <button
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
          onClick={() => document.getElementById("addAssignmentForm").classList.toggle("tw-hidden")}
        >
          <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
          Agregar Tarea
        </button>
      </div>
      <form id="addAssignmentForm" className="tw-mb-6 tw-hidden">
        <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-3 tw-gap-4">
          <input
            type="text"
            name="title"
            value={newAssignment.title}
            onChange={handleInputChange}
            placeholder="Título de la tarea"
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="class"
            value={newAssignment.class}
            onChange={handleInputChange}
            placeholder="Clase"
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={newAssignment.dueDate}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="tw-mt-4 tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md"
          onClick={handleAddAssignment}
        >
          Agregar Tarea
        </button>
      </form>
      <div className="tw-space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-flex tw-justify-between tw-items-center"
          >
            <div>
              <h4 className="tw-font-semibold">{assignment.title}</h4>
              <p className="tw-text-sm tw-text-gray-600">{assignment.class}</p>
              <p className="tw-text-sm tw-text-gray-600">Fecha límite: {assignment.dueDate}</p>
            </div>
            <div className="tw-flex tw-items-center">
              <button
                className={`tw-mr-2 tw-px-2 tw-py-1 tw-rounded ${
                  assignment.status === "Completada"
                    ? "tw-bg-green-100 tw-text-green-800"
                    : "tw-bg-yellow-100 tw-text-yellow-800"
                }`}
                onClick={() => handleToggleStatus(assignment.id)}
              >
                {assignment.status}
              </button>
              <button className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-2">
                <Edit className="tw-w-5 tw-h-5" />
              </button>
              <button className="tw-text-red-600 hover:tw-text-red-900">
                <Trash className="tw-w-5 tw-h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherAssignments

