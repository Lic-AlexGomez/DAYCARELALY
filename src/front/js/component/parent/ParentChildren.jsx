import React, { useEffect, useContext } from "react"
import { User, Calendar, Book } from "lucide-react"
import { Context } from "../../store/appContext"

const ParentChildren = () => {
  const { store, actions } = useContext(Context)

  useEffect(() => {
    actions.fetchParentChildren()
  }, [store])

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Mis Hijos</h3>
      <div className="tw-grid tw-grid-cols-1 tw-md:grid-cols-2 tw-gap-6">
        {store.parentChildren.map((child) => (
          <div key={child.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <div className="tw-flex tw-items-center tw-mb-4">
              <User className="tw-w-12 tw-h-12 tw-text-blue-500 tw-mr-4" />
              <div>
                <h4 className="tw-text-lg tw-font-semibold">{child.name}</h4>
                <p className="tw-text-gray-600">{child.age} años</p>
              </div>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Book className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>Clase: {child.class}</span>
            </div>
            <div className="tw-flex tw-items-center">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>Horario: {child.schedule}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParentChildren

