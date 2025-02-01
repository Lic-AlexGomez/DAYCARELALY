import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const ServicesView = () => {
  const { actions, store } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({
    image: 0, 
    name: '',
    description: '',
  });

 useEffect(() => {
     actions.fetchServices();
   }, []);



  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Servicios</h2>
      <div className="tw-mb-6">
        <form  className="tw-flex tw-space-x-4">
         
          <div className='tw-flex-1'>
            <label htmlFor="name" className='tw-block tw-mb-2'>Nombre del serivico</label>
            <input
              type="text"
              name="nombreDelServicio"
              placeholder="nombreDelServicio"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div className='tw-flex-1'>
            <label htmlFor="description" className='tw-block tw-mb-2'>Descripcion</label>
            <input
              type="text"
              name="description"
              placeholder="Descripcion de la clase"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <div className='tw-flex-1'>
            <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
            <input
              type="file"
              name="image"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Servicio
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Descripcion</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Imagen</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                {classItem.image ? <img src={classItem.image} alt="Class" className="tw-w-16 tw-h-16 tw-object-cover" /> : "No image"}
              </td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3" onClick={() => handleEditClass(classItem)}>
                  <Edit className="tw-w-5 tw-h-5" />
                </button>
                <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteClass(classItem.id)}>
                  <Trash className="tw-w-5 tw-h-5" />
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
              <h3 className="tw-text-xl tw-font-semibold">Editar Servicio</h3>
              <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-6 tw-h-6" />
              </button>
            </div>
            <form  className="tw-space-y-4">
              <div className='tw-flex-1'>
                <label htmlFor="teacher_id" className='tw-block tw-mb-2'>Teacher ID</label>
                <select
                  name="teacher_id"
                  onChange={handleInputChange}
                  value={editingClass.teacher_id} 
                >
                  <option value={0} disabled>select an option</option>
                  {teachers.map(item => (
                    <option key={`teacher-${item.id}`} value={item.id}>{item.username}</option>
                  ))}
                </select>
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="name" className='tw-block tw-mb-2'>Nombre de la clase</label>
                <input
                  type="text"
                  name="name"
                  value={editingClass.name}
                  onChange={handleInputChange}
                  placeholder="Nombre de la clase"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="description" className='tw-block tw-mb-2'>Descripcion</label>
                <input
                  type="text"
                  name="description"
                  value={editingClass.description}
                  onChange={handleInputChange}
                  placeholder="Descripcion de la clase"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="Capacity" className='tw-block tw-mb-2'>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={editingClass.capacity}
                  onChange={handleInputChange}
                  placeholder="Capacidad"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="Price" className='tw-block tw-mb-2'>Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingClass.price}
                  onChange={handleInputChange}
                  placeholder="Costo"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="Age" className='tw-block tw-mb-2'>Rango de Edad</label>
                <input
                  type="text"
                  name="age"
                  value={editingClass.age}
                  onChange={handleInputChange}
                  placeholder="rango de edad"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              <div className='tw-flex-1'>
                <label htmlFor="time" className='tw-block tw-mb-2'>Horario</label>
                <input
                  type="text"
                  name="time"
                  value={editingClass.time}
                  onChange={handleInputChange}
                  placeholder="Horario"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
                />
              </div>
              {editingClass.image && (
                <div className="tw-mb-4">
                  <h4 className="tw-text-sm">Imagen Actual:</h4>
                  <img src={editingClass.image} alt="Imagen del Evento" className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-md" />
                </div>
              )}


              <div className='tw-flex-1'>
                <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-blue-600"
                >
                  Guardar Cambios
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

