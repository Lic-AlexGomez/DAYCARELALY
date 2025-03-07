import React, { useState, useEffect, useContext } from "react"
import { Context } from "../../store/appContext"
import { Plus, Edit, Trash, X } from "lucide-react"

const ActivitiesView = () => {
  const { store, actions } = useContext(Context)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({

    name: "",
    description: "",
    image: null,
    age_range: "",
    time: "",
    capacity: "",
    price: "",
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
        [name]: file,  // Guardamos el archivo en el estado formData
      }))
      setImagePreview(URL.createObjectURL(file)) // Establecemos la vista previa de la imagen
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
      alert(result.error || "An error occurred while saving the program.")
    }
  }
  const getTeachers = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}api/teachers/classes`);
    if (response.ok) {
      const data = await response.json();
      setTeachers(data);
    }
  };


  useEffect(() => {
    getTeachers();
  }, []);

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
    })
  }

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity)
    setFormData({
      name: activity.name,
      description: activity.description,
      image: activity.image, // Al editar, conservamos la imagen actual de la actividad
      age_range: activity.age_range,
      time: activity.time,
      capacity: activity.capacity,
      price: activity.price,
    })
    setImagePreview(activity.image)  // Si la actividad ya tiene imagen, la mostramos como vista previa
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
        <h2 className="tw-text-2xl tw-font-semibold">Programs Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2"
        >
          <Plus className="tw-w-5 tw-h-5" />
          Add Program
        </button>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>

            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Program</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Description</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Age</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Schedule</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Capacity</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Price</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Image</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.activities.map((activity) => (
            <tr key={activity.id}>

              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.age_range}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.capacity}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.price}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                {activity.image ? <img src={activity.image} alt="Event" className="tw-w-16 tw-h-16 tw-object-cover" /> : "No image"}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3 " >
                  <Edit className="tw-w-5 tw-h-5" onClick={() => handleEditActivity(activity)} />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5" onClick={() => handleDeleteActivity(activity.id)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {showModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-p-4 tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-max-w-2xl tw-w-full tw-max-h-[90vh] tw-overflow-y-auto">
            <div className="tw-p-6">
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                <h2 className="tw-text-2xl tw-font-semibold">
                  {selectedActivity ? "Edit Program" : "Add New Program"}
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
                      src={imagePreview || " "}
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
                    {selectedActivity ? "Update Program" : "Save Program"}
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

