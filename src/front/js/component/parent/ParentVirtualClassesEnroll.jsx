import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Loader2, Plus, Trash } from "lucide-react";
import Swal from "sweetalert2";

const Card = ({ className, children, ...props }) => (
  <div
    className={`tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-sm tw-overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight tw-mb-2 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={`tw-text-sm tw-text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={`tw-flex tw-items-center tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ className, variant = "default", children, ...props }) => {
  const baseStyles =
    "tw-inline-flex tw-items-center tw-rounded-full tw-border tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2";
  const variants = {
    default: "tw-border-transparent tw-bg-primary tw-text-primary-foreground",
    secondary: "tw-border-transparent tw-bg-secondary tw-text-secondary-foreground",
    outline: "tw-text-foreground",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Componente Modal para inscribir al niño
const EnrollChildModal = ({
  show,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  store,
}) => {
  if (!show) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-p-4 tw-z-50">
      <div className="tw-bg-white tw-rounded-lg tw-max-w-2xl tw-w-full tw-max-h-[90vh] tw-overflow-y-auto">
        <div className="tw-p-6">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
            <h2 className="tw-text-2xl tw-font-semibold">Add New Child</h2>
          </div>
          <form onSubmit={handleSubmit} className="tw-space-y-4">
            <div>
              <label
                htmlFor="child_name"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
              >
                Child
              </label>
              <select
                name="child_name"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                value={formData.child_name}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select a child
                </option>
                {store.parentChildren.map((child) => (
                  <option key={child.id} value={child.name}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="classId"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
              >
                Class
              </label>
              <select
                name="classId"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                value={formData.classId}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select a class
                </option>
                {store.classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                value={formData.price}
                disabled
              />
            </div>

            <div className="tw-flex tw-justify-end tw-gap-4">
              <button
                type="button"
                onClick={onClose}
                className="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-gray-700 hover:tw-bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-md hover:tw-bg-blue-600"
              >
                Add Child
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function ParentVirtualClassesEnroll() {
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    child_name: "",
    classId: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await actions.fetchClasses();
        await actions.fetchEnrolledClasses();
        await actions.fetchParentChildren();
        await actions.fetchMyClassesParent();
        console.log(store)
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching classes. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData({
      child_name: "",
      classId: "",
      price: "",
    });
  }, [store.classes, store.parentChildren]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.classId || isNaN(parseInt(formData.classId))) {
      Swal.fire({
        icon: "error",
        title: "Invalid Class",
        text: "Please select a valid class.",
      });
      return;
    }

    if (!formData.child_name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Name",
        text: "Child name cannot be empty.",
      });
      return;
    }

    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add a new child?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) return;

    try {
      const result = await actions.enrollInClass(formData.classId, formData.child_name);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Child Added",
          text: "A new child has been added!",
        });

        setFormData({
          child_name: "",
          classId: "",
        });
        setShowModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `There was an error: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting the form. Please try again.",
      });
    }
  };
  const handleDeleteEnrollment = async (enrollmentId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this enrollment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const result = await actions.deleteEnrollment(enrollmentId);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Enrollment Removed",
          text: "The enrollment has been successfully removed.",
        });

        // Actualizar la lista después de eliminar
        await actions.fetchEnrolledClasses();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `There was an error: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion Error",
        text: "There was an error removing the enrollment. Please try again.",
      });
    }
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      child_name: "",
      classId: "",
      price: "",
    });
  };

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "classId") {
        const selectedClass = store.classes.find(
          (classItem) => classItem.id.toString() === value
        );
        updatedData = {
          ...updatedData,
          price: selectedClass ? selectedClass.price : "",
        };
      }

      console.log("Updated formData:", updatedData);
      return updatedData;
    });
  }
  const handleUnenrollClass = async (id) => {
    const confirmDelete = await Swal.fire({
      title: '¿Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await actions.unenrollClass(id);

        if (result) {
          Swal.fire({
            icon: 'success',
            title: 'unenroll succesfull',
            text: 'You has been successfully unenrolled.',
          });
          actions.fetchEnrolledClasses();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error.',
          });
        }
      } catch (error) {
        console.error("Error en handleUnenrollClass:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error.',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-text-center tw-text-red-500 tw-p-4">
        <p>{error}</p>
      </div>
    );
  }
  console.log(store.enrolledClasses)
  console.log(store.classes)
  return (
    <div className="tw-container tw-mx-auto tw-p-4">
      <h1 className="tw-text-3xl tw-font-bold tw-mb-6">Available Virtual Classes</h1>

      {/* Tarjetas de las clases disponibles */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {store.classes.map((classItem) => (
          <Card
            key={classItem.id}
            className="tw-flex tw-flex-col tw-transition-all tw-duration-300 hover:tw-shadow-lg"
          >
            <div className="tw-relative">
              <img
                src={classItem.image || "/placeholder.svg?height=200&width=400"}
                alt={classItem.name}
                className="tw-w-full tw-h-48 tw-object-cover"
              />
              <Badge variant="secondary" className="tw-absolute tw-top-2 tw-right-2">
                {classItem.age}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>{classItem.name}</CardTitle>
              <CardDescription>{classItem.description}</CardDescription>
            </CardHeader>
            <CardContent className="tw-flex-grow">
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-space-x-2">
                  <Badge variant="outline">{classItem.time}</Badge>
                </div>
                <p className="tw-font-semibold tw-text-lg">${classItem.price.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>


      <div className="tw-p-4">
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2"
          >
            <Plus className="tw-w-5 tw-h-5" />
            Enroll my child
          </button>
        </div>

        {store.enrolledClasses ? (
          <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
            <thead className="tw-bg-gray-100">
              <tr>
                <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                  Child
                </th>
                <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                  Class
                </th>
                <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                  Date of enroll
                </th>
                <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="tw-divide-y tw-divide-gray-200">
              {store.enrolledClasses.map((activity) => (



                <tr key={activity.id}>

                  <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity?.child_name || "No class available"}</td>
                  <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.class?.name || "No class available"}</td>
                  <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity?.enrolled_at || "No class available"}</td>
                  <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                    <button
                      className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3"
                    
                    ></button>

                    <button
                      className="tw-text-red-600 hover:tw-text-red-900"
                      onClick={() => handleUnenrollClass(activity.id)} 
                    >
                      <Trash className="tw-w-5 tw-h-5" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="tw-text-center tw-p-4 tw-text-gray-500">No enrollments found</div>
        )}


        <EnrollChildModal
          show={showModal}
          onClose={handleCloseModal}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          store={store}
        />
      </div>
    </div>
  );
}

export default ParentVirtualClassesEnroll;