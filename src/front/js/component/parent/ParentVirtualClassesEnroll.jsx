import React, { useState, useEffect, useContext } from "react"
import { Context } from "../../store/appContext"
import { Loader2, UserPlus, UserMinus, Users, Plus, Trash } from "lucide-react"
import Swal from "sweetalert2"


const Card = ({ className, children, ...props }) => (
  <div
    className={`tw-bg-white tw-rounded-lg tw-border tw-border-gray-200 tw-shadow-sm tw-overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight tw-mb-2 ${className}`} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ className, children, ...props }) => (
  <p className={`tw-text-sm tw-text-gray-500 ${className}`} {...props}>
    {children}
  </p>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const CardFooter = ({ className, children, ...props }) => (
  <div className={`tw-flex tw-items-center tw-p-6 tw-pt-0 ${className}`} {...props}>
    {children}
  </div>
)

// // Button component
// const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
//   const baseStyles =
//     "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-pointer-events-none tw-ring-offset-background"
//   const variants = {
//     default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
//     outline: "tw-border tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground",
//     secondary: "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
//   }
//   const sizes = {
//     default: "tw-h-10 tw-py-2 tw-px-4",
//     sm: "tw-h-9 tw-px-3",
//     lg: "tw-h-11 tw-px-8",
//     icon: "tw-h-10 tw-w-10",
//   }

//   return (
//     <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
//       {children}
//     </button>
//   )
// }


const Badge = ({ className, variant = "default", children, ...props }) => {
  const baseStyles =
    "tw-inline-flex tw-items-center tw-rounded-full tw-border tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold tw-transition-colors focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-ring focus:tw-ring-offset-2"
  const variants = {
    default: "tw-border-transparent tw-bg-primary tw-text-primary-foreground",
    secondary: "tw-border-transparent tw-bg-secondary tw-text-secondary-foreground",
    outline: "tw-text-foreground",
  }

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

function ParentVirtualClassesEnroll() {
  const { store, actions } = useContext(Context)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    child_name: "",
    class_name: "",
    price:"",
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        await actions.fetchClasses()
        await actions.fetchEnrolledClasses()
        setLoading(false)
      } catch (err) {
        setError("An error occurred while fetching classes. Please try again later.")
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add a new child?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, add!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) {
      return;
    }

    try {
      const result = await actions.enrollInClass(
        formData.child_name,
        formData.class_name,
        formData.price,
      );

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Child Added",
          text: "A new child has been added!",
        });
        actions.fetchEnrolledClasses();
        setFormData({
          child_name: 0,
          class_name: 0,
        });
        setShowModal(false); // This line will close the modal
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

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({

      child_name: "",
      class_name: ""
    })
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "class_name") {
      const selectedClass = store.classes.find(classItem => classItem.name === value);
      setFormData({
        ...formData,
        [name]: value,
        price: selectedClass ? selectedClass.price : 0 // Establecemos el precio de la clase seleccionada
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    console.log("Updated formData:", { ...formData, [name]: value });
  };


  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="tw-text-center tw-text-red-500 tw-p-4">
        <p>{error}</p>
      </div>
    )
  }



  return (
    <div className="tw-container tw-mx-auto tw-p-4">
      <h1 className="tw-text-3xl tw-font-bold tw-mb-6">Available Virtual Classes</h1>

      {/* Contenedor de las tarjetas */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {store.classes.map((classItem) => {
          return (
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
          );
        })}
      </div>

      {/* Botón para inscribir al niño y tabla de clases */}
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

        {/* Tabla de clases inscritas */}
        <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
          <thead className="tw-bg-gray-100">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Child</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Class</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Date of enroll</th>
              <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="tw-divide-y tw-divide-gray-200">
            {store.enrolledClasses.map((activity) => (
              <tr key={activity.id}>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.child_name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.class_name}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{activity.enrolled_at}</td>
                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                  <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3 " ></button>
                  <button className="tw-text-red-600 hover:tw-text-red-900">
                    <Trash className="tw-w-5 tw-h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para agregar niño */}
        {showModal && (
          <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-p-4 tw-z-50">
            <div className="tw-bg-white tw-rounded-lg tw-max-w-2xl tw-w-full tw-max-h-[90vh] tw-overflow-y-auto">
              <div className="tw-p-6">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                  <h2 className="tw-text-2xl tw-font-semibold">
                    Add New child
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="tw-space-y-4">
                  <div>
                    <label htmlFor="child_name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      child
                    </label>
                    <select
                      name="child_name"
                      className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                      value={formData.child_name}
                      onChange={handleInputChange}
                    >
                      <option value={0} disabled>Select a child</option>
                      {store.parentChildren.map(child => (
                        <option key={child.id} value={child.name}>{child.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="class_name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Class
                    </label>
                    <select
                      name="class_name"
                      className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                      value={formData.class_name}
                      onChange={handleInputChange}
                    >
                      <option value={0} disabled>Select a class</option>
                      {store.classes.map(child => (
                        <option key={child.id} value={child.name}>{child.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled 
                    />
                  </div>

                  <div className="tw-flex tw-justify-end tw-gap-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-text-gray-700 hover:tw-bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="tw-px-4 tw-py-2 tw-bg-blue-500 tw-text-white tw-rounded-md hover:tw-bg-blue-600"
                    >
                      add child
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

}

export default ParentVirtualClassesEnroll