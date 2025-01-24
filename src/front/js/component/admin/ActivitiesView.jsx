import React, { useState, useEffect, useContext } from "react"
import { Context } from "../../store/appContext"
import { Plus, Edit, Trash, X } from "lucide-react"

const ActivitiesView = () => {
  const { store, actions } = useContext(Context)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    age_range: "",
    time: "",
    capacity: "",
    price: "",
    skills_to_develop: "",
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    actions.fetchActivities()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      const file = files[0]
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }))
      setImagePreview(URL.createObjectURL(file))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = selectedActivity
      ? await actions.updateActivity(selectedActivity.id, formData)
      : await actions.createActivity(formData)

    if (result.success) {
      handleCloseModal()
      actions.fetchActivities()
    } else {
      alert(result.error || "An error occurred while saving the activity.")
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedActivity(null)
    setImagePreview(null)
    setFormData({
      name: "",
      description: "",
      image: null,
      age_range: "",
      time: "",
      capacity: "",
      price: "",
      skills_to_develop: "",
    })
  }

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity)
    setFormData({
      name: activity.name,
      description: activity.description,
      image: activity.image,
      age_range: activity.age_range,
      time: activity.time,
      capacity: activity.capacity,
      price: activity.price,
      skills_to_develop: activity.skills_to_develop,
    })
    setImagePreview(activity.image)
    setShowModal(true)
  }

  const handleDeleteActivity = async (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const result = await actions.deleteActivity(id)
      if (result.success) {
        actions.fetchActivities()
      } else {
        alert(result.error || "An error occurred while deleting the activity.")
      }
    }
  }

  return (
    <div className="tw-p-4">
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
        <h2 className="tw-text-2xl tw-font-semibold">Activities Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2"
        >
          <Plus className="tw-w-5 tw-h-5" />
          Add Activity
        </button>
      </div>

      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {store.activities.map((activity) => (
          <div key={activity.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
            <img
              src={activity.image || "/placeholder.svg"}
              alt={activity.name}
              className="tw-w-full tw-h-48 tw-object-cover"
            />
            <div className="tw-p-4">
              <h3 className="tw-text-xl tw-font-semibold tw-text-black tw-mb-2">{activity.name}</h3>
              <p className="tw-text-gray-600 tw-mb-4 tw-line-clamp-2">{activity.description}</p>

              <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-mb-4">
                <div className="tw-text-center">
                  <p className="tw-text-sm tw-text-gray-500">Age:</p>
                  <p className="tw-font-semibold">{activity.age_range}</p>
                </div>
                <div className="tw-text-center">
                  <p className="tw-text-sm tw-text-gray-500">Time:</p>
                  <p className="tw-font-semibold">{activity.time}</p>
                </div>
                <div className="tw-text-center">
                  <p className="tw-text-sm tw-text-gray-500">Capacity:</p>
                  <p className="tw-font-semibold">{activity.capacity} Kids</p>
                </div>
              </div>

              <div className="tw-flex tw-justify-between tw-items-center">
                <button
                  onClick={() => handleEditActivity(activity)}
                  className="tw-bg-yellow-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-md tw-flex tw-items-center"
                >
                  <Edit className="tw-w-4 tw-h-4 tw-mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="tw-bg-red-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-md tw-flex tw-items-center"
                >
                  <Trash className="tw-w-4 tw-h-4 tw-mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-p-4 tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-max-w-2xl tw-w-full tw-max-h-[90vh] tw-overflow-y-auto">
            <div className="tw-p-6">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                <h2 className="tw-text-2xl tw-font-semibold">
                  {selectedActivity ? "Edit Activity" : "Add New Activity"}
                </h2>
                <button onClick={handleCloseModal} className="tw-text-gray-500 hover:tw-text-gray-700">
                  <X className="tw-w-6 tw-h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="tw-space-y-4">
                <div>
                  <label htmlFor="name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="tw-mt-1 tw-block tw-w-full"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="tw-mt-2 tw-w-full tw-h-48 tw-object-cover tw-rounded-md"
                    />
                  )}
                </div>

                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <div>
                    <label htmlFor="age_range" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Age Range
                    </label>
                    <input
                      type="text"
                      id="age_range"
                      name="age_range"
                      value={formData.age_range}
                      onChange={handleInputChange}
                      className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Time
                    </label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="capacity" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="skills_to_develop" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                    Skills to Develop
                  </label>
                  <textarea
                    id="skills_to_develop"
                    name="skills_to_develop"
                    value={formData.skills_to_develop}
                    onChange={handleInputChange}
                    rows={3}
                    className="tw-mt-1 tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-blue-500 focus:tw-ring-blue-500"
                  />
                </div>

                <div className="tw-flex tw-justify-end tw-gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-gray-700 hover:tw-bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-md hover:tw-bg-blue-600"
                  >
                    {selectedActivity ? "Update Activity" : "Save Activity"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivitiesView

