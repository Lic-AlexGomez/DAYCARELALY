import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const ClassesView = () => {
  const { actions, store } = useContext(Context);
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    teacher_id: 0, // Inicializado como número
    name: '',
    description: '',
    capacity: '',
    price: '',
    age: '',
    time: '',
    image: ''
  });

  useEffect(() => {
    actions.fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingClass) {
      setEditingClass({ ...editingClass, [name]: value });
    } else {
      setNewClass({ ...newClass, [name]: value });
    }
  };

  const handleImageChange = async (e) => {
    const result = await actions.uploadToCloudinary(e.target.files[0]);
    if (result.success) {
      setNewClass({ ...newClass, image: result.url });
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();

    // Validar que teacher_id no sea 0
    if (newClass.teacher_id === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un profesor.',
      });
      return;
    }

    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this class?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) {
      return;
    }

    try {
      const result = await actions.addClass(
        newClass.teacher_id,
        newClass.name,
        newClass.description,
        newClass.capacity,
        newClass.price,
        newClass.age,
        newClass.time,
        newClass.image
      );

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Class Added",
          text: "A new class has been added!",
        });
        actions.fetchClasses();
        setNewClass({
          teacher_id: 0,
          name: '',
          description: '',
          capacity: '',
          price: '',
          age: '',
          time: '',
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
      console.error("Error in handleAddClass:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting the form. Please try again.",
      });
    }
  };

  const handleEditClass = (classes) => {
    setEditingClass(classes);
    setIsModalOpen(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    await actions.updateClass(editingClass.id, editingClass);
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleDeleteClass = async (id) => {
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
        const result = await actions.deleteClass(id);

        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'Clase eliminada',
            text: 'La clase ha sido eliminada con éxito.',
          });
          actions.fetchClasses();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al eliminar la clase.',
          });
        }
      } catch (error) {
        console.error("Error en handleDeleteClass:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al intentar eliminar la clase. Intenta nuevamente.',
        });
      }
    }
  };

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

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Clases</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddClass} className="tw-flex tw-space-x-4">
          <div className='tw-flex-1'>
            <label htmlFor="teacher_id" className='tw-block tw-mb-2'>Teacher ID</label>
            <select
              name="teacher_id"
              onChange={handleInputChange}
              value={newClass.teacher_id} // Controla el valor con el estado
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
              value={newClass.name}
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
              value={newClass.description}
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
              value={newClass.capacity}
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
              value={newClass.price}
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
              value={newClass.age}
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
              value={newClass.time}
              onChange={handleInputChange}
              placeholder="Horario"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <div className='tw-flex-1'>
            <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              placeholder="image"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>

          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Clase
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Profesor</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Nombre</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Descripcion</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Capacidad</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Precio</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Edad</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Horario</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Imagen</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.teacher_id}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.description}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.capacity}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.price}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.age}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.time}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.image}</td>
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
              <h3 className="tw-text-xl tw-font-semibold">Editar Clase</h3>
              <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                <X className="tw-w-6 tw-h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateClass} className="tw-space-y-4">
              <div className='tw-flex-1'>
                <label htmlFor="teacher_id" className='tw-block tw-mb-2'>Teacher ID</label>
                <select
                  name="teacher_id"
                  onChange={handleInputChange}
                  value={editingClass.teacher_id} // Controla el valor con el estado
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
              <div className='tw-flex-1'>
                <label htmlFor="image" className='tw-block tw-mb-2'>Imagen</label>
                <img src={editingClass.image} alt=''/>
                <input
                  type="file"
                  name="image"
                
                  onChange={handleImageChange}
                  placeholder="image"
                  className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                  required
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

export default ClassesView;

