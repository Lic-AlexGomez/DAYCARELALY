import React from "react"
import { Users, BookOpen, FileText, DollarSign, TrendingUp, Calendar } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const Overview = () => {
  const stats = [
    { title: "Total Clientes", value: "1,234", icon: Users, color: "tw-bg-blue-500" },
    { title: "Clases Activas", value: "25", icon: BookOpen, color: "tw-bg-green-500" },
    { title: "Nuevas Inscripciones", value: "15", icon: FileText, color: "tw-bg-yellow-500" },
    { title: "Ingresos Mensuales", value: "$45,231", icon: DollarSign, color: "tw-bg-purple-500" },
    { title: "Tasa de Crecimiento", value: "8.5%", icon: TrendingUp, color: "tw-bg-red-500" },
    { title: "Eventos Próximos", value: "3", icon: Calendar, color: "tw-bg-indigo-500" },
  ]

  const monthlyData = [
    { name: "Ene", ingresos: 4000, gastos: 2400, inscripciones: 20 },
    { name: "Feb", ingresos: 3000, gastos: 1398, inscripciones: 25 },
    { name: "Mar", ingresos: 2000, gastos: 9800, inscripciones: 18 },
    { name: "Abr", ingresos: 2780, gastos: 3908, inscripciones: 30 },
    { name: "May", ingresos: 1890, gastos: 4800, inscripciones: 22 },
    { name: "Jun", ingresos: 2390, gastos: 3800, inscripciones: 28 },
  ]

  const classAttendance = [
    { name: "Lun", estudiantes: 40 },
    { name: "Mar", estudiantes: 35 },
    { name: "Mié", estudiantes: 45 },
    { name: "Jue", estudiantes: 38 },
    { name: "Vie", estudiantes: 42 },
  ]

  return (
    <div>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-6 tw-mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-items-center">
              <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
                <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
              </div>
              <div className="tw-ml-4">
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700">{stat.title}</h3>
                <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-lg:grid-cols-2 tw-gap-6">
        <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresos" fill="#8884d8" />
              <Bar dataKey="gastos" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Monthly Registrations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inscripciones" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classAttendance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="estudiantes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Overview

