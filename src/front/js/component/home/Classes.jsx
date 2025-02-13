import React, { useState, useEffect, useContext } from "react"
import { Context } from "../../store/appContext"
import book from "../../../img/books.png"

export const Classes = () => {
  const { store, actions } = useContext(Context)
  const [visibleClasses, setVisibleClasses] = useState(8)

  useEffect(() => {
    actions.fetchClasses()
  }, [])

  const handleShowMore = () => {
    setVisibleClasses((prev) => prev + 4)
  }

  return (
    <div className="tw-bg-white tw-py-12">
      <div className="tw-container tw-mx-auto tw-px-4 tw-text-center tw-mb-12">
        <img src={book || " "} alt="Books icon" className="tw-mx-auto tw-mb-2 tw-w-16 md:tw-w-20" />
        <div className="tw-text-[#9C29B2] tw-text-sm md:tw-text-base tw-mb-2 font-bold">On Going Classes</div>
        <h2 className="tw-text-2xl md:tw-text-3xl tw-font-bold title-component-class tw-text-[#9C29B2] tw-px-4">
          Take The Classes & Start<br className="tw-hidden sm:tw-inline" /> Learning From Today
        </h2>
      </div>

      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-4 md:tw-gap-6 tw-mx-3.5">
          {store.classes.slice(0, visibleClasses).map((classItem) => (
            <div
              key={classItem.id}
              className="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-border-4 tw-border-[#FFC909] tw-flex tw-flex-col tw-min-h-[450px] md:tw-min-h-[500px]"
            >
              {/* Imagen responsive */}
              <div className="tw-relative tw-pb-[56.25%] tw-max-h-48 md:tw-max-h-56">
                <img
                  src={classItem.image || " "}
                  alt={classItem.name}
                  className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover"
                />
              </div>

              {/* Contenido de la tarjeta */}
              <div className="tw-p-4 tw-bg-[#9C29B2] tw-text-white tw-flex-grow tw-flex tw-flex-col">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3 tw-gap-2">
                  <h3 className="tw-text-lg tw-font-bold tw-truncate">{classItem.name}</h3>
                  <div className="tw-bg-[#FFC909] tw-text-[#9C29B2] tw-px-3 tw-py-1.5 tw-rounded-full tw-font-bold tw-whitespace-nowrap">
                    ${classItem.price}
                  </div>
                </div>

                <p className="tw-text-sm tw-mb-4 tw-opacity-90 tw-text-left tw-line-clamp-3">
                  {classItem.description}
                </p>

                <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-mb-4 tw-text-sm">
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909] tw-px-1">
                    <div className="tw-text-[#FFC909] tw-font-bold">Age:</div>
                    <div className="tw-truncate">{classItem.age}</div>
                  </div>
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909] tw-px-1">
                    <div className="tw-text-[#FFC909] tw-font-bold">Time:</div>
                    <div className="tw-truncate">{classItem.time}</div>
                  </div>
                  <div className="tw-text-center tw-px-1">
                    <div className="tw-text-[#FFC909] tw-font-bold">Capacity:</div>
                    <div className="tw-truncate">{classItem.capacity}</div>
                  </div>
                </div>

                <div className="tw-mt-auto">
                  <button className="tw-w-full hover:tw-bg-[#9C29B2] hover:tw-text-white tw-py-2 tw-border tw-border-white tw-rounded-full tw-text-sm tw-bg-[#FFC909] tw-text-[#9C29B2] tw-transition-colors tw-whitespace-nowrap">
                    Read more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleClasses < store.classes.length && (
          <div className="tw-text-center tw-mt-8">
            <button
              onClick={handleShowMore}
              className="tw-bg-[#9C29B2] tw-text-white tw-px-6 md:tw-px-8 tw-py-2.5 md:tw-py-3 tw-rounded-full hover:tw-bg-[#FFC909] hover:tw-text-[#9C29B2] tw-transition-colors tw-text-sm md:tw-text-base"
            >
              More Classes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Classes