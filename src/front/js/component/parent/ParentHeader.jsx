import React, { useContext,useEffect, useState } from "react"
import { Bell, User,ShoppingBag } from "lucide-react"
import { Context } from "../../store/appContext"
import { Link } from "react-router-dom"

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
              <Link to={"/parent-dashboard/payments"}><button  className="tw-text-red-500 " >
                <ShoppingBag className="tw-w-6 tw-h-6" />
              {store.enrolledClasses.length > 0 ? <span className="tw-absolute tw-top-2  tw-right-2 tw-w-6 tw-h-6 tw-bg-blue-500 tw-text-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs">{store.enrolledClasses.length }</span> 
              : null} 
            </button></Link>
              
              
          </div>
        </div>
      </div>
    </header>
  )
}

export default ParentHeader

