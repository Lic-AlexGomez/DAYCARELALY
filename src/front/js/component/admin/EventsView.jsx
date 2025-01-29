import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash,X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";


const EventsView = () => {
  const { actions, store } = useContext(Context)
  const [newEvent, setNewEvent] = useState({  name: '', date: '', description: '',  image: '' });

  
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
            <label htmlFor="fecha" className='tw-block tw-mb-2'>Fecha del evento</label>
            <input
              type="number"
              name="fecha"
              value={newEvent.date}
              placeholder="fecha del evento"
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
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Fecha</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Imagen</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.date}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.image}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3 " >
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5" />
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

