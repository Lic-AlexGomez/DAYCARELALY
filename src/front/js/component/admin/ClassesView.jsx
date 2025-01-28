import React, { useContext, useState,useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";


const ClassesView = () => {
  const { actions, store } = useContext(Context)
  const [teachers,setTeachers] = useState([])
  const [classes, setClasses] = useState([
    { id: 1, name: 'Clase de Arte', description: 'esto es una prueba', teacher_id: 'Ana Gómez', capacity: 15, price: '$20', age: '5-7', time: 'Lunes y Miércoles 10:00-11:30', image: 'image.png' },
    { id: 2, name: 'Clase de Ingles', description: 'esto es una prueba', teacher_id: 'Juan Gómez', capacity: 20, price: '$15', age: '7-10', time: 'Lunes y Miércoles 10:00-11:30', image: 'image.png' },
    { id: 3, name: 'Clase de Japones', description: 'esto es una prueba', teacher_id: 'Pedro Gómez', capacity: 25, price: '$10', age: '4-7', time: 'Lunes y Miércoles 10:00-11:30', image: 'image.png' },
  ]);

  const [newClass, setNewClass] = useState({ teacher_id: '', name: '', description: '', capacity: '', price: '', age: '', time: '', image: '' });

  const handleInputChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e)=>{
    const result = await actions.uploadToCloudinary(e.target.files[0])
    if(result.success){
      setNewClass({ ...newClass, image: result.url });
    }
  }
  const handleAddClass = async (e) => {
    e.preventDefault();
    setClasses([...classes, { id: classes.length + 1, ...newClass }]);
    setNewClass({ teacher_id: '', name: '', description: '', capacity: '', price: '', age: '', time: '', image: '' });
    
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
      console.log(result);

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Class Added",
          text: "a new class has been added!",
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

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(classItem => classItem.id !== id));
  };
  const getTeachers = async()=>{
    const response=await fetch (`${process.env.BACKEND_URL}api/teachers/classes`)
    if(response.ok){
     const data= await response.json()
     setTeachers(data)
    }
 }
  
  useEffect(()=>{
     getTeachers()
  },[])

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Clases</h2>
      <div className="tw-mb-6">
        <form onSubmit={handleAddClass} className="tw-flex tw-space-x-4">
          <div className='tw-flex-1'>
            <label htmlFor="teacher_id" className='tw-block tw-mb-2'>Teacher ID</label>
            {/* <input
              type="text"
              name="teacher_id"
              value={newClass.teacher_id}
              onChange={handleInputChange}
              placeholder="Profesor"
              className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            /> */}
            <select name="teacher_id" onChange={handleInputChange} defaultValue={0} >
              <option value={0} disabled>select an option</option>
              { teachers.map(item => {
                return (
                  <option key={`teacher-${item.id}`} value={item.id}>{item.username}</option>
                )
              })
              
              }
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
          <div className='tw-flex-1' >
            <label htmlFor="Age" className='tw-block tw-mb-2'> Rango de Edad</label>
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
              // value={newClass.image}
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
          {classes.map((classItem) => (
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
                <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3">
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
    </div>
  );
};

export default ClassesView;

