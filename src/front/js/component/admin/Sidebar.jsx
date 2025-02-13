import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  HomeIcon as House,
  Users,
  Clock,
  BookOpen,
  FileText,
  Mail,
  Activity,
  UserX,
  Settings,
  CalendarIcon as Calendar1,
  Menu,
  X,

} from "lucide-react"

const menuItems = [
  { icon: House, label: "Dashboard", path: "/admin-dashboard" },
  { icon: Users, label: "Clients", path: "/admin-dashboard/clients" },
  { icon: Clock, label: "Schedule", path: "/admin-dashboard/schedule-management" },
  { icon: BookOpen, label: "Classes", path: "/admin-dashboard/classes" },
  { icon: Calendar1, label: "Events", path: "/admin-dashboard/events" },
  { icon: FileText, label: "Enrolls", path: "/admin-dashboard/enrollments" },
  { icon: Mail, label: "Emails", path: "/admin-dashboard/emails" },
  { icon: Mail, label: "Get in touch", path: "/admin-dashboard/get-in-touch" },
  { icon: Activity, label: "Programs", path: "/admin-dashboard/activities" },
  { icon: UserX, label: "Inactive Accounts", path: "/admin-dashboard/inactive-accounts" },
  { icon: UserX, label: "Services", path: "/admin-dashboard/services" },
  { icon: UserX, label: "Gallery", path: "/admin-dashboard/gallery" },
  { icon: Users, label: "Sign up Staff", path: "/admin-dashboard/staff-signup" },
  { icon: Settings, label: "Settings", path: "/admin-dashboard/settings" },
]

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
   
      <button className="tw-fixed tw-top-2 tw-left-4 tw-z-50 tw-block md:tw-hidden " onClick={toggleSidebar}>
        {isOpen ? <X className="tw-w-6 tw-h-6" /> : <Menu className="tw-w-8 tw-h-8" />}
      </button>

   
      {isOpen && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-40 md:tw-hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <nav
        className={`
        tw-fixed tw-top-0 tw-left-0 tw-h-full tw-bg-gray-100 tw-p-4 tw-space-y-1 tw-overflow-y-auto tw-dark:tw-bg-gray-800
        tw-transition-transform tw-duration-300 tw-ease-in-out tw-z-50
        ${isOpen ? "tw-translate-x-0" : "tw--translate-x-full"}
        md:tw-translate-x-0 md:tw-w-64 md:tw-static
      `}
      >
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 tw-dark:tw-text-white">Admin Dashboard</h2>
          <button className="md:tw-hidden" onClick={toggleSidebar}>
            <X className="tw-w-6 tw-h-6" />
          </button>
        </div>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            className="tw-inline-flex tw-items-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 [&_svg]:tw-pointer-events-none [&_svg]:tw-size-4 [&_svg]:tw-shrink-0 hover:tw-bg-accent hover:tw-text-accent-foreground tw-h-10 tw-px-4 tw-py-2 tw-w-full tw-justify-start"
            to={item.path}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="tw-mr-2 tw-h-4 tw-w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}

export default Sidebar

