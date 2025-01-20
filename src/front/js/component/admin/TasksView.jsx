
import React, { useState } from "react"
import { Check, Edit, Trash } from "lucide-react"

const initialTasks = [
  {
    id: 1,
    title: "Preparar material para clase de arte",
    assignee: "María García",
    dueDate: "2023-07-05",
    priority: "Alta",
    status: "Pendiente",
    completed: false,
  },
  {
    id: 2,
    title: "Revisar inscripciones para el campamento de verano",
    assignee: "Juan Pérez",
    dueDate: "2023-07-10",
    priority: "Media",
    status: "En Progreso",
    completed: false,
  },
  {
    id: 3,
    title: "Actualizar el inventario de materiales",
    assignee: "Ana Rodríguez",
    dueDate: "2023-07-15",
    priority: "Baja",
    status: "Completada",
    completed: true,
  },
]

function TasksView() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [newTask, setNewTask] = useState({ title: "", assignee: "", dueDate: "", priority: "", status: "Pendiente" })
  const [editingTaskId, setEditingTaskId] = useState(null)

  const filteredTasks = tasks.filter(
    (task) =>
      (filter === "all" || task.status === filter) && task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "tw-bg-red-500"
      case "Media":
        return "tw-bg-yellow-500"
      case "Baja":
        return "tw-bg-green-500"
      default:
        return "tw-bg-gray-500"
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingTaskId !== null) {
      setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, [name]: value } : task)))
    } else {
      setNewTask({ ...newTask, [name]: value })
    }
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (editingTaskId !== null) {
      setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, ...newTask } : task)))
      setEditingTaskId(null)
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }])
    }
    setNewTask({ title: "", assignee: "", dueDate: "", priority: "", status: "Pendiente" })
  }

  const handleToggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleEditTask = (task) => {
    setEditingTaskId(task.id)
    setNewTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setNewTask({ title: "", assignee: "", dueDate: "", priority: "", status: "Pendiente" })
  }

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task)))
  }

  return (
    <div className="tw-p-6">
      <h1 className="tw-text-2xl tw-font-bold tw-mb-6">Gestión de Tareas</h1>

      <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6 tw-mb-6">
        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">
          {editingTaskId !== null ? "Editar Tarea" : "Añadir Nueva Tarea"}
        </h2>
        <form onSubmit={handleAddTask} className="tw-flex tw-flex-wrap tw-gap-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Título de la tarea"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="text"
            name="assignee"
            value={newTask.assignee}
            onChange={handleInputChange}
            placeholder="Asignado a"
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          >
            <option value="">Seleccionar prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <select
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
          >
            {editingTaskId !== null ? "Actualizar Tarea" : "Añadir Tarea"}
          </button>
          {editingTaskId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="tw-bg-white tw-shadow-md tw-rounded-lg tw-p-6">
        <div className="tw-mb-4 tw-flex tw-justify-between">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-max-w-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-w-[180px]"
          >
            <option value="all">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-flex tw-items-center tw-justify-between tw-mb-4 ${task.completed ? "tw-opacity-50" : ""}`}
          >
            <div className="tw-flex tw-items-center">
              <button
                onClick={() => handleToggleComplete(task.id)}
                className={`tw-mr-4 tw-p-1 tw-rounded-full ${task.completed ? "tw-bg-green-500" : "tw-border tw-border-gray-300"}`}
              >
                {task.completed && <Check className="tw-w-4 tw-h-4 tw-text-white" />}
              </button>
              <div>
                <h3 className={`tw-text-lg tw-font-medium ${task.completed ? "tw-line-through" : ""}`}>{task.title}</h3>
                <p className="tw-text-sm tw-text-gray-500">Asignado a: {task.assignee}</p>
                <p className="tw-text-sm tw-text-gray-500">Fecha límite: {task.dueDate}</p>
                <div
                  className={`tw-mt-2 tw-inline-block tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-text-white ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="tw-ml-2 tw-border tw-border-gray-300 tw-rounded-md tw-px-2 tw-py-1 tw-text-sm"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>
            </div>
            <div>
              <button
                className="tw-mr-2 tw-p-1 tw-text-blue-500 hover:tw-text-blue-700"
                onClick={() => handleEditTask(task)}
              >
                <Edit className="tw-w-5 tw-h-5" />
              </button>
              <button
                className="tw-p-1 tw-text-red-500 hover:tw-text-red-700"
                onClick={() => handleDeleteTask(task.id)}
              >
                <Trash className="tw-w-5 tw-h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



export default TasksView;

