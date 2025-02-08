import React, { useState, useContext, useEffect } from "react"
import { Context } from "../../store/appContext"
import { AlertCircle, Plus, X } from "lucide-react"

const Card = ({ className, children, ...props }) => (
  <div
    className={`tw-bg-white tw-shadow-lg tw-rounded-xl tw-border tw-border-purple-200 tw-overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
)

const Button = ({ className, children, ...props }) => (
  <button
    className={`tw-px-4 tw-py-2 tw-bg-purple-600 tw-text-white tw-rounded-full tw-font-semibold tw-text-sm tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-bg-purple-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-500 focus:tw-ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className, ...props }) => (
  <input
    className={`tw-w-full tw-px-4 tw-py-2 tw-border tw-border-purple-300 tw-rounded-lg tw-text-gray-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-500 tw-transition-all tw-duration-300 ${className}`}
    {...props}
  />
)

const Label = ({ className, children, ...props }) => (
  <label className={`tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1 ${className}`} {...props}>
    {children}
  </label>
)

const Alert = ({ variant, className, children, ...props }) => (
  <div
    className={`tw-p-4 tw-rounded-lg tw-flex tw-items-center ${
      variant === "error" ? "tw-bg-red-100 tw-text-red-700" : "tw-bg-purple-100 tw-text-purple-700"
    } ${className}`}
    {...props}
  >
    {children}
  </div>
)

const ParentChildren = () => {
  const { store, actions } = useContext(Context)
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [newChild, setNewChild] = useState({
    name: "",
    date_of_birth: "",
    allergies: "",
    birth_certificate: null,
    immunization_records: null,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [addChildError, setAddChildError] = useState("")

  useEffect(() => {
    if (!store.parentChildren) {
      actions.fetchParentChildren()
    }
  }, [store.parentChildren, actions])

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    setNewChild((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const validateForm = () => {
    const formErrors = {}
    if (!newChild.name.trim()) formErrors.name = "Child's name is required"
    if (!newChild.date_of_birth) formErrors.date_of_birth = "Date of birth is required"
    if (!newChild.birth_certificate) formErrors.birth_certificate = "Birth certificate is required"
    if (!newChild.immunization_records) formErrors.immunization_records = "Immunization records are required"
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setAddChildError("")
      try {
        const birthCertificateUrl = await actions.uploadToCloudinary(newChild.birth_certificate)
        const immunizationRecordsUrl = await actions.uploadToCloudinary(newChild.immunization_records)

        const childData = {
          parent_id: store.user.id,
          name: newChild.name,
          date_of_birth: newChild.date_of_birth,
          allergies: newChild.allergies,
          immunization_records: immunizationRecordsUrl.url,
          birth_certificate: birthCertificateUrl.url,
        }

        const response = await actions.addChild(childData)
        console.log("response", response)
        if (response == true) {
          setIsAddingChild(false)
          setNewChild({
            name: "",
            date_of_birth: "",
            allergies: "",
            birth_certificate: null,
            immunization_records: null,
          })
        } else {
          setAddChildError(response.error || "Failed to add child. Please try again.")
        }
      } catch (error) {
        console.error("Add child error:", error)
        setAddChildError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!store.parentChildren) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-text-2xl tw-font-semibold tw-text-purple-600">Loading children information...</div>
      </div>
    )
  }

  return (
    <div className="tw-max-w-6xl tw-mx-auto tw-p-6">
      <h2 className="tw-text-3xl tw-font-bold tw-mb-8 tw-text-purple-800">My Children</h2>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {store.parentChildren.map((child) => (
          <Card key={child.id}>
            <CardContent>
              <h3 className="tw-text-xl tw-font-semibold tw-mb-3 tw-text-purple-700">{child.name}</h3>
              <p className="tw-mb-2">
                <span className="tw-font-medium tw-text-gray-600">Date of Birth:</span>{" "}
                <span className="tw-text-gray-800">{child.date_of_birth}</span>
              </p>
              <p>
                <span className="tw-font-medium tw-text-gray-600">Allergies:</span>{" "}
                <span className="tw-text-gray-800">{child.allergies || "None"}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="tw-mt-12">
        {!isAddingChild ? (
          <Button onClick={() => setIsAddingChild(true)} className="tw-flex tw-items-center">
            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
            Add New Child
          </Button>
        ) : (
          <Card className="tw-bg-purple-50">
            <CardContent>
              <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
                <h3 className="tw-text-2xl tw-font-semibold tw-text-purple-800">Add New Child</h3>
                <button
                  onClick={() => setIsAddingChild(false)}
                  className="tw-text-gray-500 hover:tw-text-gray-700 focus:tw-outline-none"
                >
                  <X className="tw-w-6 tw-h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="tw-space-y-6">
                <div>
                  <Label htmlFor="name">Child's Name</Label>
                  <Input id="name" name="name" value={newChild.name} onChange={handleInputChange} required />
                  {errors.name && <p className="tw-text-sm tw-text-red-500 tw-mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={newChild.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.date_of_birth && <p className="tw-text-sm tw-text-red-500 tw-mt-1">{errors.date_of_birth}</p>}
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies (if any)</Label>
                  <Input id="allergies" name="allergies" value={newChild.allergies} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="birth_certificate">Birth Certificate (PDF)</Label>
                  <Input
                    id="birth_certificate"
                    name="birth_certificate"
                    type="file"
                    onChange={handleInputChange}
                    accept=".pdf"
                    required
                    className="tw-file:tw-mr-4 tw-file:tw-py-2 tw-file:tw-px-4 tw-file:tw-rounded-full tw-file:tw-border-0 tw-file:tw-text-sm tw-file:tw-font-semibold tw-file:tw-bg-purple-50 tw-file:tw-text-purple-700 hover:tw-file:tw-bg-purple-100"
                  />
                  {errors.birth_certificate && (
                    <p className="tw-text-sm tw-text-red-500 tw-mt-1">{errors.birth_certificate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="immunization_records">Immunization Records (PDF)</Label>
                  <Input
                    id="immunization_records"
                    name="immunization_records"
                    type="file"
                    onChange={handleInputChange}
                    accept=".pdf"
                    required
                    className="tw-file:tw-mr-4 tw-file:tw-py-2 tw-file:tw-px-4 tw-file:tw-rounded-full tw-file:tw-border-0 tw-file:tw-text-sm tw-file:tw-font-semibold tw-file:tw-bg-purple-50 tw-file:tw-text-purple-700 hover:tw-file:tw-bg-purple-100"
                  />
                  {errors.immunization_records && (
                    <p className="tw-text-sm tw-text-red-500 tw-mt-1">{errors.immunization_records}</p>
                  )}
                </div>
                {addChildError && (
                  <Alert variant="error" className="tw-mt-4">
                    <AlertCircle className="tw-h-5 tw-w-5 tw-mr-2" />
                    {addChildError}
                  </Alert>
                )}
                <div className="tw-flex tw-justify-end tw-space-x-4">
                  <Button
                    type="button"
                    onClick={() => setIsAddingChild(false)}
                    className="tw-bg-gray-300 tw-text-gray-700 hover:tw-bg-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Child"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ParentChildren

