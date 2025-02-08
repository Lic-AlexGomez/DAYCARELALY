import React, { useState, useEffect,useContext } from "react"
import { Context } from "../../store/appContext"
import { Loader2, UserPlus, UserMinus, Users } from "lucide-react"


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

// Button component
const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const baseStyles =
    "tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-pointer-events-none tw-ring-offset-background"
  const variants = {
    default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
    outline: "tw-border tw-border-input hover:tw-bg-accent hover:tw-text-accent-foreground",
    secondary: "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
  }
  const sizes = {
    default: "tw-h-10 tw-py-2 tw-px-4",
    sm: "tw-h-9 tw-px-3",
    lg: "tw-h-11 tw-px-8",
    icon: "tw-h-10 tw-w-10",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Badge component
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleEnrollToggle = async (classId) => {
    try {
      const isEnrolled = store.enrolledClasses.some((c) => c.id === classId)
      if (isEnrolled) {
        await actions.unenrollFromClass(classId)
      } else {
        await actions.enrollInClass(classId)
      }
    } catch (err) {
      setError(isEnrolled ? "Failed to unenroll from class." : "Failed to enroll in class.")
    }
  }

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
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {store.classes.map((classItem) => {
          const isEnrolled = store.enrolledClasses.some((c) => c.id === classItem.id)
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
                    <Users className="tw-w-4 tw-h-4" />
                    <span>{classItem.capacity} spots</span>
                  </div>
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <Badge variant="outline">{classItem.time}</Badge>
                  </div>
                  <p className="tw-font-semibold tw-text-lg">${classItem.price.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleEnrollToggle(classItem.id)}
                  variant={isEnrolled ? "secondary" : "default"}
                  className="tw-w-full"
                >
                  {isEnrolled ? (
                    <>
                      <UserMinus className="tw-mr-2 tw-h-4 tw-w-4" />
                      Unenroll
                    </>
                  ) : (
                    <>
                      <UserPlus className="tw-mr-2 tw-h-4 tw-w-4" />
                      Enroll Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ParentVirtualClassesEnroll