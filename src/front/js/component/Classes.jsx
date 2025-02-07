import React, { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import book from "../../img/books.png"

export const Classes = () => {
  const { store, actions } = useContext(Context)
  const [visibleClasses, setVisibleClasses] = useState(8)

  useEffect(() => {
    actions.fetchClasses()
  }, []) // Added actions as a dependency

  const handleShowMore = () => {
    setVisibleClasses((prev) => prev + 4)
  }

  return (
    <div className="tw-bg-white tw-py-12">
      <div className="tw-container tw-mx-auto tw-px-4 tw-text-center tw-mb-12">
        <img src={book || "/placeholder.svg"} alt="Sandwich icon" className="tw-mx-auto tw-mb-2" />
        <div className="tw-text-[#9C29B2] tw-text-sm tw-mb-2 font-bold">On Going Classes</div>
        <h2 className="tw-text-3xl tw-font-bold title-component-class tw-text-[#9C29B2]">
          Take The Classes & Start
          <br />
          Learning From Today
        </h2>
      </div>

      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
          {store.classes.slice(0, visibleClasses).map((classItem) => (
            <div
              key={classItem.id}
              className="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-border-4 tw-border-[#FFC909] tw-flex tw-flex-col tw-h-[500px]"
            >
              <div className="tw-relative tw-pb-[56.25%]">
                <img
                  src={classItem.image || "/placeholder.svg"}
                  alt={classItem.name}
                  className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover"
                />
              </div>
              <div className="tw-p-4 tw-bg-[#9C29B2] tw-text-white tw-flex-grow tw-flex tw-flex-col">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <h3 className="tw-text-lg tw-font-bold">{classItem.name}</h3>
                  <div className="tw-bg-[#FFC909] tw-text-[#9C29B2] tw-px-2 tw-py-2 tw-rounded-full tw-font-bold">
                    ${classItem.price}
                  </div>
                </div>
                <p className="tw-text-sm tw-mb-4 tw-opacity-90 tw-text-left">{classItem.description}</p>
                <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-mb-4 tw-text-sm">
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909]">
                    <div className="tw-text-[#FFC909] tw-font-bold">Age:</div>
                    <div>{classItem.age}</div>
                  </div>
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909]">
                    <div className="tw-text-[#FFC909] tw-font-bold">Time:</div>
                    <div>{classItem.time}</div>
                  </div>
                  <div className="tw-text-center">
                    <div className="tw-text-[#FFC909] tw-font-bold">Capacity:</div>
                    <div>{classItem.capacity}</div>
                  </div>
                </div>
                <div className="tw-mt-auto">
                  <button className="tw-w-full hover:tw-bg-[#9C29B2] hover:tw-text-white tw-py-2 tw-border tw-border-white tw-rounded-full tw-text-sm tw-bg-[#FFC909] tw-text-[#9C29B2] tw-transition-colors">
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
              className="tw-bg-[#9C29B2] tw-text-white tw-px-8 tw-py-3 tw-rounded-full hover:tw-bg-[#FFC909] hover:tw-text-[#9C29B2] tw-transition-colors"
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

