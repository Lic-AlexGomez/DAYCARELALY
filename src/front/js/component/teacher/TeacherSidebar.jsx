import React from "react"
import { NavLink } from "react-router-dom"
import { Home, Users, BookOpen, CheckSquare, Calendar, Settings } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Inicio", path: "/teacher-dashboard" },
  { icon: BookOpen, label: "Mis Clases", path: "/teacher-dashboard/classes" },
  { icon: Users, label: "Estudiantes", path: "/teacher-dashboard/students" },
  { icon: CheckSquare, label: "Tareas", path: "/teacher-dashboard/assignments" },
  { icon: Calendar, label: "Horario", path: "/teacher-dashboard/schedule" },
  { icon: Settings, label: "Configuración", path: "/teacher-dashboard/settings" },
]

const TeacherSidebar = () => {
  return (
    <nav className="tw-bg-white tw-w-64 tw-h-full tw-border-r tw-border-gray-200">
      <div className="tw-flex tw-items-center tw-justify-center tw-h-16 tw-border-b tw-border-gray-200">
        <span className="tw-text-xl tw-font-semibold tw-text-gray-800">Kiddy Rainbow Slime Co.</span>
      </div>
      <div className="tw-p-4">
        <ul className="tw-space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className="tw-flex tw-items-center tw-p-2 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-100"
                activeClassName="tw-bg-gray-100 tw-text-blue-600"
              >
                <item.icon className="tw-w-5 tw-h-5 tw-mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default TeacherSidebar

