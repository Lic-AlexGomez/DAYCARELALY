import React, { useState,useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Users, BookOpen, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Actions } from '@cloudinary/url-gen/index';



const DashboardOverview = () => {
  const { store, actions } = useContext(Context)
  const [activeTab, setActiveTab] = useState('overview');

useEffect(()=>{
  actions.GetClients()
},[])

const tabs = [
  { id: 'overview', label: 'Resumen' },
  { id: 'clients', label: 'Clientes' },
  { id: 'classes', label: 'Clases y Servicios' },
  { id: 'enrollments', label: 'Inscripciones' },
];

const stats = [
  { title: 'Total de Clientes', value:store.clients.length, icon: Users, color: 'tw-bg-blue-500' , link: '/admin-dashboard/clients', linkText: 'Gestionar Clientes' },
  { title: 'Total Clases Activas', value:store.classes.length, icon: BookOpen, color: 'tw-bg-green-500' , link: '/admin-dashboard/classes', linkText: 'Ver Clases' },
  { title: 'Nuevas Inscripciones', value: '15', icon: FileText, color: 'tw-bg-yellow-500', link: '/admin-dashboard/enrollments', linkText: 'Ver Inscripciones' },
  { title: 'Ingresos Mensuales', value: store.events.length*200, icon: DollarSign, color: 'tw-bg-purple-500', link: '/admin-dashboard/reports', linkText: 'Ver Informes' },
  // { title: 'Tasa de Crecimiento', value: '8.5%', icon: TrendingUp, color: 'tw-bg-red-500' , link: '/admin-dashboard/reports', linkText: 'Ver Informes' },
  { title: 'Eventos Próximos', value: store.events.length, icon: Calendar, color: 'tw-bg-indigo-500', link: '/admin-dashboard/reports', linkText: 'Ver Informes' },
];

// const monthlyData = [
//   { name: 'Ene', ingresos: 4000, gastos: 2400, inscripciones: 20 },
//   { name: 'Feb', ingresos: 3000, gastos: 1398, inscripciones: 25 },
//   { name: 'Mar', ingresos: 2000, gastos: 9800, inscripciones: 18 },
//   { name: 'Abr', ingresos: 2780, gastos: 3908, inscripciones: 30 },
//   { name: 'May', ingresos: 1890, gastos: 4800, inscripciones: 22 },
//   { name: 'Jun', ingresos: 2390, gastos: 3800, inscripciones: 28 },
// ];

// const classAttendance = [
//   { name: 'Lun', estudiantes: 40 },
//   { name: 'Mar', estudiantes: 35 },
//   { name: 'Mié', estudiantes: 45 },
//   { name: 'Jue', estudiantes: 38 },
//   { name: 'Vie', estudiantes: 42 },
// ];

// Componentes para el contenido de cada pestaña
const OverviewTab = () =>
  
(<>
   
  <div className="tw-grid tw-grid-cols-6 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-6 tw-mb-8 tw-my-6" >
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
        
        <div to={stat.link} className="` tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-justify-center tw-my-5 tw-rounded tw-bg-gray-100 tw-text-center tw-py-2 hover:tw-text-black hover:tw-bg-cyan-500  ">
        <Link to={stat.link} className="">

        {stat.linkText}

        </Link>
        </div>
                     
      
      </div> 
    ))}
  </div>
  {/* <div className="tw-mb-8 tw-p-6 tw-bg-white tw-rounded-lg tw-shadow-md">
        <h3 className="tw-text-xl  tw-font-semibold tw-mb-4">Estadísticas</h3>
      </div>
      <div className="tw-grid tw-grid-cols-1 tw-lg:grid-cols-2 tw-gap-6">
        <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Ingresos vs Gastos</h3>
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
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Inscripciones Mensuales</h3>
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
          <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Asistencia Semanal</h3>
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
      </div> */}
  </>
);

const ClientsTab = () => (
  <div className="tw-space-y-6">
    <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800">Gestión de Clientes</h3>
    <p className="tw-text-lg tw-text-gray-700">
      Aquí puedes gestionar a tus clientes, ver su información, historial y acciones recientes.
    </p>
    <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
    <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              ID
            </th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Nombre
            </th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Email
            </th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Teléfono
            </th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Estado
            </th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
    <tbody className="tw-divide-y tw-divide-gray-200">
          {store.clients.map((client) => (
            <tr key={client.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.id}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.email}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{client.phone}</td>
              <td className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                {client.status === "Activo" ? (
                  <span className="tw-inline-flex tw-items-center tw-justify-center tw-py-1 tw-px-2 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-green-100 tw-text-green-800">
                    Activo
                  </span>
                ) : (
                  <span className="tw-inline-flex tw-items-center tw-justify-center tw-py-1 tw-px-2 tw-rounded-full tw-text-xs tw-font-semibold tw-bg-red-100 tw-text-red-800">
                    Inactivo
                  </span>
                )}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap"><button>Ver</button></td>
            </tr>
          ))}
        </tbody>
    </table>
  </div>
);

const ClassesTab = () => (
  <div className="tw-space-y-6">
    <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800">Clases y Servicios</h3>
    <p className="tw-text-lg tw-text-gray-700">
      Gestiona las clases disponibles y los servicios que ofreces. Agrega o modifica horarios y tarifas.
    </p>
    <div className="tw-grid tw-grid-cols-3 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-6">
      {[
        { name: 'Math', schedule: 'Lunes a Viernes - 7 AM', price: '$20' },
        { name: 'Math', schedule: 'Martes y Jueves - 6 PM', price: '$25' },
        { name: 'Math', schedule: 'Todos los días - 8 PM', price: '$30' },
      ].map((classItem, index) => (
        <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">{classItem.name}</h4>
          <p className="tw-text-gray-600">{classItem.schedule}</p>
          <p className="tw-font-bold tw-text-gray-900">{classItem.price}</p>
          <button className="tw-mt-3 tw-bg-cyan-500 tw-text-white tw-py-2 tw-px-4 tw-rounded">Modificar</button>
        </div>
      ))}
    </div>
  </div>
);

const EnrollmentsTab = () => (
  <div className="tw-space-y-6">
    <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800">Inscripciones</h3>
    <p className="tw-text-lg tw-text-gray-700">
      Consulta las inscripciones recientes y administra la lista de espera.
    </p>
    <div className="tw-overflow-x-auto">
      <table className="tw-min-w-full tw-border tw-rounded-lg tw-shadow-md">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-gray-600">Estudiante</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-gray-600">Clase</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-gray-600">Fecha</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-sm tw-font-medium tw-text-gray-600">Estado</th>
          </tr>
        </thead>
        <tbody>
          {[
            { student: 'Juan Pérez', class: 'Yoga Matutino', date: '2025-01-18', status: 'Confirmado' },
            { student: 'Ana López', class: 'Pilates Intermedio', date: '2025-01-19', status: 'Pendiente' },
            { student: 'Carlos Gómez', class: 'Crossfit', date: '2025-01-20', status: 'Cancelado' },
          ].map((enrollment, index) => (
            <tr key={index} className="tw-border-b">
              <td className="tw-px-6 tw-py-4 tw-text-gray-800">{enrollment.student}</td>
              <td className="tw-px-6 tw-py-4 tw-text-gray-800">{enrollment.class}</td>
              <td className="tw-px-6 tw-py-4 tw-text-gray-800">{enrollment.date}</td>
              <td className="tw-px-6 tw-py-4 tw-text-gray-800">{enrollment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
);




  
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'clients':
        return <ClientsTab />;
      case 'classes':
        return <ClassesTab />;
      case 'enrollments':
        return <EnrollmentsTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Panel de Control</h2>

      <div className="tw-inline-flex tw-my-10 tw-h-10 tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-p-1 tw-text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-sm tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 ${
              activeTab === tab.id ? 'tw-bg-cyan-500 tw-text-neutral-50 tw-shadow-sm' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

     
    </div>
  );
};

export default DashboardOverview;
