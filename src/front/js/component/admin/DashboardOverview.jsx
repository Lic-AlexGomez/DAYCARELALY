import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { Context } from "../../store/appContext"
import { Users, BookOpen, FileText, DollarSign, TrendingUp, Calendar } from "lucide-react"

const DashboardOverview = () => {
  const { store, actions } = useContext(Context)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    actions.GetClients()
  }, [store.clients.length])

  const tabs = [{ id: "overview", label: "Summary" }]

  const stats = [
    {
      title: "Total Clients",
      value: store.clients.length,
      icon: Users,
      color: "tw-bg-blue-500",
      link: "/admin-dashboard/clients",
      linkText: "Manage Clients",
    },
    {
      title: "Total Active Classes",
      value: store.classes.length,
      icon: BookOpen,
      color: "tw-bg-green-500",
      link: "/admin-dashboard/classes",
      linkText: "See Classes",
    },
    {
      title: "New Registrations",
      value: store.subscriptions.length,
      icon: FileText,
      color: "tw-bg-yellow-500",
      link: "/admin-dashboard/enrollments",
      linkText: "See Registrations",
    },
    {
      title: "Total programs ",
      value: store.activities.length,
      icon: DollarSign,
      color: "tw-bg-purple-500",
      link: "/admin-dashboard/activities",
      linkText: "See programs",
    },
    {
      title: "Active Services",
      value: store.services.length,
      icon: TrendingUp,
      color: "tw-bg-red-500",
      link: "/admin-dashboard/services",
      linkText: "See Services",
    },
    {
      title: "Upcoming Events",
      value: store.events.length,
      icon: Calendar,
      color: "tw-bg-indigo-500",
      link: "/admin-dashboard/events",
      linkText: "Ver eventos",
    },
  ]

  const OverviewTab = () => (
    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8 tw-my-6">
      {stats.map((stat, index) => (
        <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
              <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
            </div>
            <div className="tw-ml-4">
              <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700">{stat.title}</h3>
              <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-justify-center tw-rounded tw-bg-gray-100 tw-text-center tw-py-2 hover:tw-text-black hover:tw-bg-cyan-500">
            <Link to={stat.link}>{stat.linkText}</Link>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      default:
        return null
    }
  }

  return (
    <div className="tw-p-4">
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Control Panel</h2>

      <div className="tw-flex tw-flex-wrap tw-gap-2 tw-mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium tw-transition-all focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 ${
              activeTab === tab.id
                ? "tw-bg-cyan-500 tw-text-white tw-shadow-sm"
                : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  )
}

export default DashboardOverview

