import React,{ useEffect, useContext } from "react"
import { Video, Calendar, Clock } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentVirtualClasses = () => {
  const { store, actions } = useContext(Context)

  useEffect(() => {
    actions.fetchParentVirtualClasses()
  }, [])

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Virtual Classes</h3>
      <div className="tw-space-y-4">
        {store.parentVirtualClasses.map((virtualClass) => (
          <div key={virtualClass.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{virtualClass.name}</h4>
            <p className="tw-text-gray-600 tw-mb-4">{virtualClass.description}</p>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{virtualClass.date}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Clock className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{virtualClass.time}</span>
            </div>
            <div className="tw-flex tw-items-center tw-mt-4">
              <Video className="tw-w-5 tw-h-5 tw-text-blue-500 tw-mr-2" />
              <a
                href={virtualClass.link ? virtualClass.link : "https://meet.google.com/qxp-rjnw-dbr"} 
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-blue-500 hover:tw-underline tw-pointer-events-auto tw-cursor-pointer"
              >
                Join virtual class
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentVirtualClasses

