import React, { useContext,useEffect } from "react"
import { Bell, User } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentHeader = () => {
  const { store, actions } = useContext(Context)

  useEffect(() => {
    actions.fetchParentData()
  }, [])

  return (
    <header className="tw-bg-white tw-border-b tw-border-gray-200">
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h1 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Parent Panel</h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <button className="tw-text-gray-500 hover:tw-text-gray-700">
              <Bell className="tw-w-6 tw-h-6" />
            </button>
            <div className="tw-flex tw-items-center tw-space-x-2">
              <User className="tw-w-6 tw-h-6 tw-text-gray-700" />
              <span className="tw-text-gray-700">{store.user?.username || "Cargando..."}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ParentHeader

