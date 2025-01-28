import React, { useEffect, useContext } from "react"
import { Context } from "../../store/appContext"
import { Video, Calendar, Clock } from "lucide-react"

const ParentVirtualClasses = () => {
  const { store, actions } = useContext(Context)

  useEffect(() => {
    actions.getVirtualClasses()
  }, []) // Added actions to the dependency array

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Clases Virtuales</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-lg:grid-cols-3 tw-gap-6">
        {store.parentvirtualClasses.map((virtualClass) => (
          <div key={virtualClass.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-items-center tw-mb-4">
              <Video className="tw-w-8 tw-h-8 tw-text-blue-500 tw-mr-3" />
              <h4 className="tw-text-lg tw-font-semibold">{virtualClass.name}</h4>
            </div>
            <p className="tw-text-gray-600 tw-mb-4">{virtualClass.description}</p>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{virtualClass.date}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-4">
              <Clock className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{virtualClass.time}</span>
            </div>
            <a
              href={virtualClass.link}
              target="_blank"
              rel="noopener noreferrer"
              className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-inline-block hover:tw-bg-blue-600"
            >
              Unirse a la clase
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentVirtualClasses

