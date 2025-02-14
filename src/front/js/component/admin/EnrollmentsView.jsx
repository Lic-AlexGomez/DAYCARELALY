import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import { Plus, Edit, Trash } from 'lucide-react';
import Swal from "sweetalert2";

const EnrollmentsView = () => {
  const { actions, store } = useContext(Context);
  const [searchTerm, setSearchTerm] = useState("")
  const [enrollments, setEnrollments] = useState({
    student_name: 0,
    class_name: 0,
    start_date: '',
  });

  useEffect(() => {
    actions.fetchEnrolledClasses();
    
    
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
            title: 'Subscripcion eliminada',
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
        console.error("Error en handleDeleteEnrollment:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al intentar eliminar la subscripcion. Intenta nuevamente.',
        });
      }
    }
  };
  // const filteredStudent = store.parentChildren.filter(
  //   (account) =>
  //     account.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  return (
    <div className="tw-p-4">
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Registration Management</h2>
      <div className="tw-mb-6">
      
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-w-full tw-max-w-sm"
        />
        {/* <form className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4" onSubmit={handleAddSubscription}>
          <div>
            <select
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              name="student_name"
              onChange={handleInputChange}
              value={enrollments.student_name}
            >
              <option value={0} disabled>Select an option</option>
              {store.parentChildren.map(item => (
                <option key={`student-${item.id}`} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              name="class_name"
              onChange={handleInputChange}
              value={enrollments.class_name}
            >
              <option value={0} disabled>Select an option</option>
              {store.classes.map(item => (
                <option key={`class-${item.id}`} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="date"
              name="start_date"
              value={enrollments.start_date}
              onChange={handleInputChange}
              className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-col-span-full md:tw-col-span-1"
          >
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Add Registration
          </button>
        </form> */}
      </div>
      <div className="tw-overflow-x-auto">
        <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
          <thead className="tw-bg-gray-100">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Student</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Class</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Registration Date</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="tw-divide-y tw-divide-gray-200">
            {store.enrolledClasses.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.child_name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.class.name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{enrollment.enrolled_at}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <button
                    className="tw-text-red-600 hover:tw-text-red-900"
                    onClick={() => handleDeleteEnrollment(enrollment.id)}
                  >
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentsView;