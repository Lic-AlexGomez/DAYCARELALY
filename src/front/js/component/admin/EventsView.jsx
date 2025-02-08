import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const EventsView = () => {
  const { actions, store } = useContext(Context)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    image: ''
  });

  useEffect(() => {
    actions.fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };


  const handleImageChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setNewEvent(prevState => ({
        ...prevState,
        image: result.url
      }));
    }
  };

  const handleImageEditChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setEditingEvent((prevState) => {
        const updatedEvent = {
          ...prevState,
          image: result.url,
        };
        return updatedEvent;
      });
    }
  };
  

  const handleAddEvent = async (e) => {
    e.preventDefault();

    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) {
      return;
    }

    try {
      const result = await actions.addEvent(
        newEvent.name,
        newEvent.description,
        newEvent.start_time,
        newEvent.end_time,
        newEvent.image,

      );
    if (result) {
        Swal.fire({
          icon: "success",
          title: "Event Added",
          text: "A new class has been added!",
        });
        actions.fetchEvents();
        setNewEvent({

          name: '',
          description: '',
          start_time: '',
          end_time: '',
          image: '',
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `There was an error: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error in handleAddEvent:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting the form. Please try again.",
      });
    }
  };
  const handleDeleteEvent = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'You are sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await actions.deleteEvent(id);

        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted event',
            text: 'The event has been successfully deleted.',
          });
          actions.fetchEvents();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error deleting the event .',
          });
        }
      } catch (error) {
        console.error("Error en handleDeleteEvent:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error trying to delete the event. Try again.',
        });
      }
    }
  }
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    await actions.updateEvent(editingEvent.id, editingEvent);
    setIsModalOpen(false);
    setEditingEvent(null);
  };


  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Event Management</h2>
      <div className="tw-mb-6">
  <form className="tw-grid tw-grid-cols-1 tw-gap-6" onSubmit={handleAddEvent}>
    <div className="tw-mb-4">
      <label htmlFor="name" className="tw-block tw-mb-2">Event Name</label>
      <input
        type="text"
        name="name"
        onChange={handleInputChange}
        value={newEvent.name}
        placeholder="Event Name"
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
        required
      />
    </div>
    <div className="tw-mb-4">
      <label htmlFor="description" className="tw-block tw-mb-2">Description</label>
      <input
        type="text"
        name="description"
        onChange={handleInputChange}
        value={newEvent.description}
        placeholder="Descripcion del evento"
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
        required
      />
    </div>
    <div className="tw-mb-4">
      <label htmlFor="start_time" className="tw-block tw-mb-2">Start date</label>
      <input
        type="datetime-local"
        name="start_time"
        onChange={handleInputChange}
        value={newEvent.start_time}
        placeholder="Start date"
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
        required
      />
    </div>
    <div className="tw-mb-4">
      <label htmlFor="end_time" className="tw-block tw-mb-2">End date</label>
      <input
        type="datetime-local"
        name="end_time"
        onChange={handleInputChange}
        value={newEvent.end_time}
        placeholder="End date"
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
        required
      />
    </div>
    <div className="tw-mb-4">
      <label htmlFor="image" className="tw-block tw-mb-2">Image</label>
      <input
        type="file"
        name="image"
        onChange={handleImageChange}
        placeholder="image"
        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
        required
      />
    </div>

    <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-mt-6">
      <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
      Add Event
    </button>
  </form>
</div>

      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>

            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Title</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Description</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Start date</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">End date</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Image</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.events.map((event) => (
            <tr key={event.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.start_time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.end_time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                {event.image ? <img src={event.image} alt="Event" className="tw-w-16 tw-h-16 tw-object-cover" /> : "No image"}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3 " >
                  <Edit className="tw-w-5 tw-h-5" onClick={() => handleEditEvent(event)} />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5" onClick={() => handleDeleteEvent(event.id)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center">
          <div className="tw-bg-white tw-p-8 tw-rounded-md tw-shadow-lg tw-w-1/2">
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
              <h3 className="tw-text-xl tw-font-semibold">Edit Class</h3>
              <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-6 tw-h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateEvent} className="tw-space-y-4">

              <div className='tw-flex-1'>
                <label htmlFor="name" className='tw-block tw-mb-2'>Event Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  value={editingEvent.name}
                  placeholder="Event Name"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="description" className='tw-block tw-mb-2'>Description</label>
                <input
                  type="text"
                  name="description"
                  onChange={handleInputChange}
                  value={editingEvent.description}
                  placeholder="Description of the event"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="start_time" className='tw-block tw-mb-2'>Start date</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  onChange={handleInputChange}
                  value={editingEvent.start_time}
                  placeholder="Start date"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="end_time" className='tw-block tw-mb-2'>End date</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  onChange={handleInputChange}
                  value={editingEvent.end_time}
                  placeholder="End date "
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>


              {editingEvent.image && (
                <div className="tw-mb-4">
                  <h4 className="tw-text-sm">Current Image:</h4>
                  <img src={editingEvent.image} alt="Imagen del Evento" className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md" />
                </div>
              )}


              <div className='tw-flex-1'>
                <label htmlFor="image" className='tw-block tw-mb-2'>Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageEditChange}
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
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

export default EventsView;

