import React, { useState,useEffect,useContext } from 'react';
import { Context } from '../../store/appContext';
import { Plus, Edit, Trash } from 'lucide-react';
import Swal from "sweetalert2";

const EnrollmentsView = () => {
  const{actions,store}=useContext(Context)

  const [enrollments, setEnrollments] = useState({
    
    student_name:'',
    class_name:'',
    start_date:'',

  })
    // {
    //   id: 1, studentName: 'Luis Martínez', className: 'Clase de Arte', enrollmentDate: '2023-05-01'
    // },
    // { id: 2, studentName: 'Ana López', className: 'Clase de Música', enrollmentDate: '2023-05-02' },
    // { id: 3, studentName: 'Pedro Ramírez', className: 'Clase de Baile', enrollmentDate: '2023-05-03' },
  

  useEffect(() => {
      actions.fetchSubscriptions();
      actions.fetchClasses();
      actions.fetchParentChildren();
    }, []);
  
  

  
  const handleInputChange = (e) => {
    setEnrollments({ ...enrollments, [e.target.name]: e.target.value });
  };
 

  const handleAddSubscription = async (e) => {
      e.preventDefault();
  
      
      const confirmSubmit = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to add this subscriptor?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, add!",
        cancelButtonText: "No, cancel",
      });
  
      if (!confirmSubmit.isConfirmed) {
        return;
      }
  
      try {
        const result = await actions.addSubscription(
          enrollments.student_name,
          enrollments.class_name,
          enrollments.start_date,
          
        );
  
        if (result) {
          Swal.fire({
            icon: "success",
            title: "Suscriptor Added",
            text: "A new suscriptor has been added!",
          });
          actions.fetchSubscriptions();
          setEnrollments({
            student_name: '',
            class_name: '',
            start_date: ''
            
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `There was an error: ${result.error}`,
          });
        }
      } catch (error) {
        console.error("Error in handleAddSubscription:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Error",
          text: "There was an error submitting the form. Please try again.",
        });
      }
    };
  

  const handleDeleteEnrollment = async (id) => {
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
          const result = await actions.deleteSubscription(id);
  
          if (result) {
            Swal.fire({
              icon: 'success',
              title: 'subscripcion eliminada',
              text: 'La subscripcion ha sido eliminada con éxito.',
            });
            actions.fetchSubscriptions();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar la subscripcion.',
            });
          }
        } catch (error) {
          console.error("Error en handleDeleteenrollment:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al intentar eliminar la subscripcion. Intenta nuevamente.',
          });
        }
      }
    }

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Gestión de Inscripciones</h2>
      <div className="tw-mb-6">
        <form  className="tw-flex tw-space-x-4" onSubmit={handleAddSubscription} >
        <div className='tw-flex-1'>
            <label htmlFor="class_name" className='tw-block tw-mb-2'> alumno</label>
            <input
            type="text"
            name="student_name"
            value={enrollments.student_name}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
            
        </div>

          <div className='tw-flex-1'>
            <label htmlFor="class_name" className='tw-block tw-mb-2'> clase</label>
            <input
            type="text"
            name="class_name"
            value={enrollments.class_name}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          </div>

          <input
            type="date"
            name="start_date"
            value={enrollments.start_date}
            onChange={handleInputChange}
            className="tw-flex-1 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
            required
          />
          <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Agregar Inscripción
          </button>
        </form>
      </div>
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Estudiante</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Clase</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Fecha de Inscripción</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {store.subscriptions.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.student_name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.class_name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.start_date}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
  
                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5"  onClick={() => handleDeleteEnrollment(enrollment.id)} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentsView;

