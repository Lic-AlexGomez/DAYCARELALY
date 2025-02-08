import { NavLink } from "react-router-dom"
import { Home, Users, Calendar, Activity, CreditCard, Settings, Video, MessageCircle, School } from "lucide-react"
import React from "react"

const menuItems = [
  { icon: Home, label: "Home", path: "/parent-dashboard" },
  { icon: Users, label: "My Children", path: "/parent-dashboard/children" },
  { icon: Calendar, label: "Schedule", path: "/parent-dashboard/schedule" },
  { icon: Activity, label: "Activities", path: "/parent-dashboard/activities" },
  { icon: CreditCard, label: "Payments", path: "/parent-dashboard/payments" },
  { icon: Video, label: "Virtual Classes", path: "/parent-dashboard/virtual-classes" },
  { icon: MessageCircle, label: "Messages", path: "/parent-dashboard/messages" },
  { icon: School, label: "Enroll Classes", path: "/parent-dashboard/virtual-classes-enroll" },
  { icon: Settings, label: "Configuration", path: "/parent-dashboard/settings" },
]

const ParentSidebar = () => {
  return (
    <nav className="tw-bg-white tw-w-64 tw-h-full tw-border-r tw-border-gray-200">
      <div className="tw-flex tw-items-center tw-justify-center tw-h-16 tw-border-b tw-border-gray-200">
        <span className="tw-text-xl tw-font-semibold tw-text-gray-800">Daycare  Slime Co.</span>
      </div>
      <div className="tw-p-4">
        <ul className="tw-space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className="tw-flex tw-items-center tw-p-2 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-100"
              
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

export default ParentSidebar

