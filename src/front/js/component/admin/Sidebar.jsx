import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon as House, Users, Clock, BookOpen, FileText, BarChartIcon as ChartNoAxesColumnIncreasing, PenLine, Package, Mail, Bell, Archive, Calendar, SquareCheckBig, Activity, Video, UserX, CircleCheckBig, PenTool, Settings } from 'lucide-react';

const menuItems = [
  { icon: House, label: 'Dashboard', path: '/admin-dashboard' },
  { icon: Users, label: 'Clientes', path: '/admin-dashboard/clients' },
  { icon: Clock, label: 'Horarios', path: '/admin-dashboard/schedule-management' },
  { icon: BookOpen, label: 'Clases', path: '/admin-dashboard/classes' },
  { icon: FileText, label: 'Inscripciones', path: '/admin-dashboard/enrollments' },
  { icon: ChartNoAxesColumnIncreasing, label: 'Informes', path: '/admin-dashboard/reports' },
  { icon: PenLine, label: 'Blog', path: '/admin-dashboard/blog' },
  { icon: Package, label: 'Inventario', path: '/admin-dashboard/inventory' },
  { icon: Mail, label: 'Correos', path: '/admin-dashboard/emails' },
  { icon: Bell, label: 'Notificaciones', path: '/admin-dashboard/notifications' },
  { icon: Archive, label: 'Archivo', path: '/admin-dashboard/archive' },
  { icon: Calendar, label: 'Programación', path: '/admin-dashboard/schedule' },
  { icon: SquareCheckBig, label: 'Tareas', path: '/admin-dashboard/tasks' },
  { icon: Activity, label: 'Actividades', path: '/admin-dashboard/activities' },
  { icon: Video, label: 'Videos', path: '/admin-dashboard/videos' },
  { icon: UserX, label: 'Cuentas Inactivas', path: '/admin-dashboard/inactive-accounts' },
  { icon: CircleCheckBig, label: 'Aprobaciones', path: '/admin-dashboard/approvals' },
  { icon: PenTool, label: 'Mantenimiento', path: '/admin-dashboard/maintenance' },
  { icon: Users, label: 'Registro Staff', path: '/admin-dashboard/staff-signup'},
  { icon: Settings, label: 'Configuración', path: '/admin-dashboard/settings' },
];

const Sidebar = () => {
  return (
    <nav className="tw-w-64 tw-bg-gray-100 tw-p-4 tw-space-y-1 tw-overflow-y-auto tw-dark:tw-bg-gray-800">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          className="tw-inline-flex tw-items-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 [&_svg]:tw-pointer-events-none [&_svg]:tw-size-4 [&_svg]:tw-shrink-0 hover:tw-bg-accent hover:tw-text-accent-foreground tw-h-10 tw-px-4 tw-py-2 tw-w-full tw-justify-start"
          to={item.path}
        >
          <item.icon className="tw-mr-2 tw-h-4 tw-w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;

