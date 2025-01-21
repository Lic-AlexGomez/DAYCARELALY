import React, { useState } from "react"
import { Search, Edit, Trash } from "lucide-react"

const TeacherStudents = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Ana García", age: 5, class: "Clase de Arte" },
    { id: 2, name: "Carlos Rodríguez", age: 6, class: "Clase de Música" },
    { id: 3, name: "Laura Martínez", age: 4, class: "Clase de Baile" },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Estudiantes</h3>
      <div className="tw-mb-6">
        <div className="tw-relative">
          <input
            type="text"
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pl-10 tw-pr-4 tw-py-2"
          />
          <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
        </div>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Nombre
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Edad
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Clase
              </th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{student.name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{student.age}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{student.class}</td>
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

export default TeacherStudents

