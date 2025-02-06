import React, { useState } from "react"
import { Plus, Edit, Trash } from "lucide-react"

const TeacherClasses = () => {
  const [classes, setClasses] = useState([
    { id: 1, name: "Clase de Arte", schedule: "Lunes y Miércoles, 10:00 AM - 11:30 AM", students: 15 },
    { id: 2, name: "Clase de Música", schedule: "Martes y Jueves, 2:00 PM - 3:30 PM", students: 12 },
    { id: 3, name: "Clase de Baile", schedule: "Viernes, 3:00 PM - 4:30 PM", students: 18 },
  ])

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h3 className="tw-text-xl tw-font-semibold">Mis Clases</h3>
        <button className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
          <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
          Agregar Clase
        </button>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Nombre de la Clase
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Horario
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Estudiantes
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.schedule}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.students}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
                  <button className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-4">
                    <Edit className="tw-w-5 tw-h-5" />
                  </button>
                  <button className="tw-text-red-600 hover:tw-text-red-900">
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeacherClasses