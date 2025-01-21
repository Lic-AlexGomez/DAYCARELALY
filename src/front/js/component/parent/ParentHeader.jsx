import React from "react"
import { Bell, User } from "lucide-react"

const ParentHeader = () => {
  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h1 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Panel de Padres</h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <button className="tw-text-gray-500 hover:tw-text-gray-700">
              <Bell className="tw-w-6 tw-h-6" />
            </button>
            <div className="tw-flex tw-items-center tw-space-x-2">
              <User className="tw-w-6 tw-h-6 tw-text-gray-700" />
              <span className="tw-text-gray-700">Sr. Martínez</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ParentHeader

