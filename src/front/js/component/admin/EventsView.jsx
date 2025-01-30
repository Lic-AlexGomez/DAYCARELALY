import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash,X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";


const EventsView = () => {
  const { actions, store } = useContext(Context)
  const [newEvent, setNewEvent] = useState({  name: '',description: '', start_time: '',end_time: '',   image: '' });

  useEffect(() => {
      actions.fetchEvents();
    }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleDeleteEvent = async (id) => {
      const confirmDelete = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
  
      if (confirmDelete.isConfirmed) {
        try {
          const result = await actions.deleteEvent(id);
  
          if (result) {
            Swal.fire({
              icon: 'success',
              title: 'Evento eliminado',
              text: 'El evento ha sido eliminada con éxito.',
            });
            actions.fetchEvents();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el evento .',
            });
          }
        } catch (error) {
          console.error("Error en handleDeleteEvent:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al intentar eliminar el evento. Intenta nuevamente.',
          });
        }
      }
    }
  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Eventos</h2>
      <div className="tw-mb-6">
        <form  className="tw-flex tw-space-x-4">
          <div className='tw-flex-1'>
            <label htmlFor="name" className='tw-block tw-mb-2'>Nombre del Evento</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              placeholder="Nombre del evento"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div className='tw-flex-1'>
            <label htmlFor="description" className='tw-block tw-mb-2'>Descripcion</label>
            <input
              type="text"
              name="description"
              value={newEvent.description}
              placeholder="Descripcion de la clase"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div className='tw-flex-1'>
            <label htmlFor="fecha de inicio" className='tw-block tw-mb-2'>Fecha de inicio</label>
            <input
              type="datetime-local"
              name="fecha de inicio"
              value={newEvent.start_time}
              placeholder="fecha de inicio"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div className='tw-flex-1'>
            <label htmlFor="fecha de termino" className='tw-block tw-mb-2'>Fecha de termino</label>
            <input
              type="datetime-local"
              name="fecha de termino"
              value={newEvent.end_time}
              placeholder="fecha de termino "
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          
          <div className='tw-flex-1'>
            <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
            <input
              type="file"
              name="image"
              // value={newClass.image}
              placeholder="image"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Evento
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Titulo</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Descripcion</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Fecha de inicio</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Fecha de termino</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Imagen</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.events.map((event) => (
            <tr key={event.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.start_time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.end_time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{event.image}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3 " >
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5" onClick={() => handleDeleteEvent(event.id)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default EventsView;

