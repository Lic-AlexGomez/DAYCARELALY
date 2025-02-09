import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const ServicesView = () => {
  const { actions, store } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    image: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    actions.fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService({ ...editingService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleImageChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setNewService({ ...newService, image: result.url });
    }
  };

  const handleImageEditChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setEditingService((prevState) => {
        const updatedService = {
          ...prevState,
          image: result.url,
        };
        return updatedService;
      });
    }
  };

  const handleEditService = (services) => {
    setEditingService(services);
    setIsModalOpen(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    await actions.updateService(editingService.id, editingService);
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleAddService = async (e) => {
    e.preventDefault();

    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this service?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) {
      return;
    }

    try {
      const result = await actions.addService(
        newService.name,
        newService.description,
        newService.image
      );

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Service Added",
          text: "A new service has been added!",
        });
        actions.fetchServices();
        setNewService({
          name: '',
          description: '',
          image: ''
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `There was an error: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error in handleAddService:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting the form. Please try again.",
      });
    }
  };

  const handleDeleteService = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await actions.deleteService(id);

        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Service Deleted',
            text: 'The service has been successfully deleted.',
          });
          actions.fetchServices();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error deleting the service.',
          });
        }
      } catch (error) {
        console.error("Error in handleDeleteService:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error trying to delete the service. Try again.',
        });
      }
    }
  };

  return (
    <div className="tw-p-4">
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Service Management</h2>
      <div className="tw-mb-6">
        <form className="tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-4" onSubmit={handleAddService}>
          <div>
            <label htmlFor="name" className="tw-block tw-mb-2">Service Name</label>
            <input
              type="text"
              name="name"
              value={newService.name}
              onChange={handleInputChange}
              placeholder="Service Name"
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="tw-block tw-mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={newService.description}
              onChange={handleInputChange}
              placeholder="Service Description"
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="tw-block tw-mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-h-10"
          >
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Add Service
          </button>
        </form>
      </div>
      <div className="tw-overflow-x-auto">
        <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
          <thead className="tw-bg-gray-100">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Name</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Description</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Image</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="tw-divide-y tw-divide-gray-200">
            {store.services.map((service) => (
              <tr key={service.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{service.name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{service.description}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  {service.image ? <img src={service.image} alt="Service" className="tw-w-16 tw-h-16 tw-object-cover" /> : "No image"}
                </td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <button
                    className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="tw-w-5 tw-h-5" />
                  </button>
                  <button
                    className="tw-text-red-600 hover:tw-text-red-900"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-p-8 tw-rounded-md tw-shadow-lg tw-w-full md:tw-w-1/2 lg:tw-w-1/3">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
              <h3 className="tw-text-xl tw-font-semibold">Edit Service</h3>
              <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-6 tw-h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateService} className="tw-space-y-4">
              <div>
                <label htmlFor="name" className="tw-block tw-mb-2">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingService.name}
                  onChange={handleInputChange}
                  placeholder="Service Name"
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="tw-block tw-mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={editingService.description}
                  onChange={handleInputChange}
                  placeholder="Service Description"
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              {editingService.image && (
                <div className="tw-mb-4">
                  <h4 className="tw-text-sm">Current Image:</h4>
                  <img src={editingService.image} alt="Service" className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md" />
                </div>
              )}
              <div>
                <label htmlFor="image" className="tw-block tw-mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageEditChange}
                  className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div className="tw-flex tw-justify-end tw-space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="tw-bg-gray-200 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;