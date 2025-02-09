import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import { Plus, Edit, Trash } from 'lucide-react';
import Swal from "sweetalert2";

const EnrollmentsView = () => {
  const { actions, store } = useContext(Context)
  const [enrollments, setEnrollments] = useState({

    student_name: 0,
    class_name: 0,
    start_date: '',

  })
  useEffect(() => {
    actions.fetchEnrolledClasses();
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
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Registration Management</h2>
      {/* <div className="tw-mb-6">
        <form className="tw-flex tw-space-x-4" onSubmit={handleAddSubscription} >
          <div className='tw-flex-1'>
            <select
              className='tw-w-full tw-border   tw-mb-2 tw-mr-2 tw-flex-1 tw-placeholder-violet-200 tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2' 
              name="student_name"
              onChange={handleInputChange}
              value={enrollments.student_name}
            >
              <option  value={0} disabled>Select an option</option>
              {store.parentChildren.map(item => (
                <option key={`student-${item.id}`} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='tw-flex-1'>
            <select
              className='tw-w-full tw-border tw-appearance-none tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-mb-2 tw-mr-2 tw-flex-1 tw-placeholder-violet-200 tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2' 
              name="class_name"
              onChange={handleInputChange}
              value={enrollments.class_name}
            >
              <option value={0} disabled>Select an option</option>
              {store.classes.map(item => (
                <option key={`student-${item.id}`} value={item.name}>{item.name}</option>
              ))}
            </select>

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
            Add Registration
          </button>
        </form>
      </div> */}
      <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
        <thead className="tw-bg-gray-100">
          <tr>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Estudiante</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Class</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Registration Date</th>
            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="tw-divide-y tw-divide-gray-200">
          {console.log(store.enrolledClasses)}
          {store.enrolledClasses.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.name}</td>
              {/* <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.class_name}</td>
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.start_date}</td> */}
              <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">

                <button className="tw-text-red-600 hover:tw-text-red-900" >
                  <Trash className="tw-w-5 tw-h-5" onClick={() => handleDeleteEnrollment(enrollment.id)} />
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

