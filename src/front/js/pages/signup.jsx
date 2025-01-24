import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { AlertCircle, Upload, ChevronDown } from "lucide-react"

// UI Components
const Card = ({ className, children, ...props }) => (
  <div className={`tw-bg-white tw-shadow-lg tw-rounded-3xl tw-border-4 tw-border-[#FFC909] ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ className, children, ...props }) => (
  <div className={`tw-p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ className, children, ...props }) => (
  <div
    className={`tw-px-6 tw-py-4 tw-border-b-4 tw-border-[#FFC909] tw-bg-[#9C29B2] tw-bg-opacity-10 tw-rounded-t-3xl ${className}`}
    {...props}
  >
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }) => (
  <h2
    className={`tw-text-3xl tw-font-bold tw-text-center tw-text-[#9C29B2] tw-font-comic-sans ${className}`}
    {...props}
  >
    {children}
  </h2>
)

const Button = ({ className, children, ...props }) => (
  <button
    className={`tw-px-6 tw-py-3 tw-bg-[#9C29B2] tw-text-white tw-rounded-full tw-font-semibold tw-text-lg tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-bg-[#FFC909] hover:tw-text-[#9C29B2] hover:tw-shadow-lg focus:tw-outline-none focus:tw-ring-4 focus:tw-ring-[#FFC909] ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className, ...props }) => (
  <input
    className={`tw-w-full tw-px-4 tw-py-3 tw-border-2 tw-border-[#9C29B2] tw-rounded-lg tw-text-gray-700 focus:tw-outline-none focus:tw-ring-4 focus:tw-ring-[#FFC909] tw-transition-all tw-duration-300 hover:tw-border-[#FFC909] ${className}`}
    {...props}
  />
)

const Label = ({ className, children, ...props }) => (
  <label className={`tw-block tw-text-lg tw-font-medium tw-text-[#9C29B2] tw-mb-2 ${className}`} {...props}>
    {children}
  </label>
)

const Select = ({ children, value, onChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="tw-relative" {...props}>
      <div
        className="tw-w-full tw-px-4 tw-py-3 tw-border-2 tw-border-[#9C29B2] tw-rounded-lg tw-text-gray-700 tw-bg-white tw-cursor-pointer tw-flex tw-items-center tw-justify-between hover:tw-border-[#FFC909] tw-transition-all tw-duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || "Select an option"}</span>
        <ChevronDown className="tw-w-5 tw-h-5 tw-text-[#9C29B2]" />
      </div>
      {isOpen && (
        <div className="tw-absolute tw-z-10 tw-w-full tw-mt-1 tw-bg-white tw-border-2 tw-border-[#9C29B2] tw-rounded-lg tw-shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onChange(child.props.value)
                setIsOpen(false)
              },
            }),
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ className, children, onClick, ...props }) => (
  <div
    className={`tw-px-4 tw-py-2 tw-cursor-pointer hover:tw-bg-[#FFC909] hover:tw-text-[#9C29B2] tw-transition-colors tw-duration-200 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
)

const Alert = ({ variant, className, children, ...props }) => (
  <div
    className={`tw-p-4 tw-rounded-lg tw-flex tw-items-center tw-border-2 ${
      variant === "destructive"
        ? "tw-bg-red-100 tw-text-red-700 tw-border-red-300"
        : "tw-bg-[#FFC909] tw-text-[#9C29B2] tw-border-[#9C29B2]"
    } ${className}`}
    {...props}
  >
    {children}
  </div>
)

const AlertTitle = ({ className, children, ...props }) => (
  <h3 className={`tw-text-lg tw-font-medium tw-mr-2 ${className}`} {...props}>
    {children}
  </h3>
)

const AlertDescription = ({ className, children, ...props }) => (
  <div className={`tw-text-sm ${className}`} {...props}>
    {children}
  </div>
)

const Tabs = ({ className, children, ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
)

const TabsList = ({ className, children, ...props }) => (
  <div className={`tw-flex tw-border-b-4 tw-border-[#FFC909] tw-mb-6 ${className}`} {...props}>
    {children}
  </div>
)

const TabsTrigger = ({ className, children, isActive, ...props }) => (
  <button
    className={`tw-px-6 tw-py-3 tw-text-lg tw-font-medium tw-rounded-t-lg tw-transition-all tw-duration-300 ${
      isActive
        ? "tw-bg-[#FFC909] tw-text-[#9C29B2]"
        : "tw-bg-[#9C29B2] tw-bg-opacity-10 tw-text-[#9C29B2] hover:tw-bg-[#FFC909] hover:tw-bg-opacity-50"
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)

const TabsContent = ({ className, children, ...props }) => (
  <div className={`tw-mt-6 ${className}`} {...props}>
    {children}
  </div>
)

export const Signup = () => {
  const { actions } = useContext(Context)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    profilePicture: null,
    // Parent specific fields
    childName: "",
    childDateOfBirth: "",
    childAllergies: "",
    emergencyContact: "",
    birthCertificate: null,
    immunizationRecords: null,
    // Teacher specific fields
    qualifications: "",
    teachingExperience: "",
    certifications: null,
    backgroundCheck: null,
    // Admin specific fields
    position: "",
    department: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [activeTab, setActiveTab] = useState("account")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prevState) => ({ ...prevState, role: value }))
  }

  const validateForm = () => {
    const formErrors = {}
    if (!formData.username.trim()) formErrors.username = "Username is required"
    if (!formData.email.trim()) formErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = "Email is invalid"
    if (!formData.password) formErrors.password = "Password is required"
    else if (formData.password.length < 6) formErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match"
    if (!formData.role) formErrors.role = "Role is required"

    // Role-specific validations
    if (formData.role === "parent") {
      if (!formData.childName.trim()) formErrors.childName = "Child's name is required"
      if (!formData.childDateOfBirth) formErrors.childDateOfBirth = "Child's date of birth is required"
      if (!formData.emergencyContact.trim()) formErrors.emergencyContact = "Emergency contact is required"
      if (!formData.birthCertificate) formErrors.birthCertificate = "Birth certificate is required"
      if (!formData.immunizationRecords) formErrors.immunizationRecords = "Immunization records are required"
    } else if (formData.role === "teacher") {
      if (!formData.qualifications.trim()) formErrors.qualifications = "Qualifications are required"
      if (!formData.teachingExperience.trim()) formErrors.teachingExperience = "Teaching experience is required"
      if (!formData.certifications) formErrors.certifications = "Certifications are required"
      if (!formData.backgroundCheck) formErrors.backgroundCheck = "Background check is required"
    } else if (formData.role === "admin") {
      if (!formData.position.trim()) formErrors.position = "Position is required"
      if (!formData.department.trim()) formErrors.department = "Department is required"
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      setSignupError("")
      try {
        const profilePictureUrl = formData.profilePicture
          ? await actions.uploadToCloudinary(formData.profilePicture)
          : null

        let additionalData = {}
        if (formData.role === "parent") {
          const birthCertificateUrl = await actions.uploadToCloudinary(formData.birthCertificate)
          const immunizationRecordsUrl = await actions.uploadToCloudinary(formData.immunizationRecords)
          additionalData = {
            childName: formData.childName,
            childDateOfBirth: formData.childDateOfBirth,
            childAllergies: formData.childAllergies,
            emergencyContact: formData.emergencyContact,
            birthCertificateUrl,
            immunizationRecordsUrl,
          }
        } else if (formData.role === "teacher") {
          const certificationsUrl = await actions.uploadToCloudinary(formData.certifications)
          const backgroundCheckUrl = await actions.uploadToCloudinary(formData.backgroundCheck)
          additionalData = {
            qualifications: formData.qualifications,
            teachingExperience: formData.teachingExperience,
            certificationsUrl,
            backgroundCheckUrl,
          }
        } else if (formData.role === "admin") {
          additionalData = {
            position: formData.position,
            department: formData.department,
          }
        }

        const signupData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          profilePicture: profilePictureUrl,
          ...additionalData,
        }

        const response = await actions.signUp(signupData)
        if (response.success) {
          navigate("/login")
        } else {
          setSignupError(response.error || "Signup failed. Please try again.")
        }
      } catch (error) {
        console.error("Signup error:", error)
        setSignupError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case "parent":
        return (
          <>
            <div className="tw-space-y-2">
              <Label htmlFor="childName">Child's Name</Label>
              <Input id="childName" name="childName" value={formData.childName} onChange={handleChange} required />
              {errors.childName && <p className="tw-text-sm tw-text-red-500">{errors.childName}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="childDateOfBirth">Child's Date of Birth</Label>
              <Input
                id="childDateOfBirth"
                name="childDateOfBirth"
                type="date"
                value={formData.childDateOfBirth}
                onChange={handleChange}
                required
              />
              {errors.childDateOfBirth && <p className="tw-text-sm tw-text-red-500">{errors.childDateOfBirth}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="childAllergies">Child's Allergies (if any)</Label>
              <Input
                id="childAllergies"
                name="childAllergies"
                value={formData.childAllergies}
                onChange={handleChange}
              />
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
              />
              {errors.emergencyContact && <p className="tw-text-sm tw-text-red-500">{errors.emergencyContact}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="birthCertificate">Birth Certificate (PDF)</Label>
              <Input
                id="birthCertificate"
                name="birthCertificate"
                type="file"
                onChange={handleChange}
                accept=".pdf"
                required
              />
              {errors.birthCertificate && <p className="tw-text-sm tw-text-red-500">{errors.birthCertificate}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="immunizationRecords">Immunization Records (PDF)</Label>
              <Input
                id="immunizationRecords"
                name="immunizationRecords"
                type="file"
                onChange={handleChange}
                accept=".pdf"
                required
              />
              {errors.immunizationRecords && <p className="tw-text-sm tw-text-red-500">{errors.immunizationRecords}</p>}
            </div>
          </>
        )
      case "teacher":
        return (
          <>
            <div className="tw-space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Input
                id="qualifications"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                required
              />
              {errors.qualifications && <p className="tw-text-sm tw-text-red-500">{errors.qualifications}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="teachingExperience">Teaching Experience</Label>
              <Input
                id="teachingExperience"
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                required
              />
              {errors.teachingExperience && <p className="tw-text-sm tw-text-red-500">{errors.teachingExperience}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="certifications">Certifications (PDF)</Label>
              <Input
                id="certifications"
                name="certifications"
                type="file"
                onChange={handleChange}
                accept=".pdf"
                required
              />
              {errors.certifications && <p className="tw-text-sm tw-text-red-500">{errors.certifications}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="backgroundCheck">Background Check (PDF)</Label>
              <Input
                id="backgroundCheck"
                name="backgroundCheck"
                type="file"
                onChange={handleChange}
                accept=".pdf"
                required
              />
              {errors.backgroundCheck && <p className="tw-text-sm tw-text-red-500">{errors.backgroundCheck}</p>}
            </div>
          </>
        )
      case "admin":
        return (
          <>
            <div className="tw-space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
              {errors.position && <p className="tw-text-sm tw-text-red-500">{errors.position}</p>}
            </div>
            <div className="tw-space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" value={formData.department} onChange={handleChange} required />
              {errors.department && <p className="tw-text-sm tw-text-red-500">{errors.department}</p>}
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="tw-mt-3 tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-b tw-from-[#FFC909] tw-to-[#a16bac] tw-px-4">
      <Card className="tw-my-14 tw-w-full tw-max-w-2xl tw-bg-white tw-bg-opacity-90">
        <CardHeader>
          <CardTitle className=" tw-text-3xl tw-font-bold tw-text-center tw-text-[#9C29B2]">
            Welcome to Colorful Kids Daycare !
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            <Tabs className="tw-w-full">
              <TabsList className="tw-grid tw-w-full tw-grid-cols-3">
                <TabsTrigger onClick={() => setActiveTab("account")} isActive={activeTab === "account"}>
                  Account Info
                </TabsTrigger>
                <TabsTrigger onClick={() => setActiveTab("profile")} isActive={activeTab === "profile"}>
                  Your Profile
                </TabsTrigger>
                <TabsTrigger onClick={() => setActiveTab("role-specific")} isActive={activeTab === "role-specific"}>
                  Role Details
                </TabsTrigger>
              </TabsList>
              {activeTab === "account" && (
                <TabsContent>
                  <div className="tw-space-y-4">
                    <div className="tw-space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
                      {errors.username && <p className="tw-text-sm tw-text-red-500">{errors.username}</p>}
                    </div>
                    <div className="tw-space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {errors.email && <p className="tw-text-sm tw-text-red-500">{errors.email}</p>}
                    </div>
                    <div className="tw-space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      {errors.password && <p className="tw-text-sm tw-text-red-500">{errors.password}</p>}
                    </div>
                    <div className="tw-space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {errors.confirmPassword && <p className="tw-text-sm tw-text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </TabsContent>
              )}
              {activeTab === "profile" && (
                <TabsContent>
                  <div className="tw-space-y-4">
                    <div className="tw-space-y-2">
                      <Label htmlFor="role">Your Role</Label>
                      <Select value={formData.role} onChange={handleRoleChange}>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </Select>
                      {errors.role && <p className="tw-text-sm tw-text-red-500">{errors.role}</p>}
                    </div>
                    <div className="tw-space-y-2">
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <div className="tw-flex tw-items-center tw-space-x-2">
                        <Input
                          id="profilePicture"
                          name="profilePicture"
                          type="file"
                          onChange={handleChange}
                          accept="image/*"
                          className="tw-hidden"
                        />
                        <Label
                          htmlFor="profilePicture"
                          className="tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-w-full tw-h-32 tw-border-2 tw-border-dashed tw-border-[#9C29B2] tw-rounded-lg tw-bg-[#FFC909] tw-bg-opacity-10 hover:tw-bg-opacity-20 tw-transition-colors"
                        >
                          {formData.profilePicture ? (
                            <img
                              src={URL.createObjectURL(formData.profilePicture) || "/placeholder.svg"}
                              alt="Profile preview"
                              className="tw-max-h-full tw-max-w-full tw-object-contain tw-rounded-lg"
                            />
                          ) : (
                            <div className="tw-text-center">
                              <Upload className="tw-mx-auto tw-h-12 tw-w-12 tw-text-[#9C29B2]" />
                              <p className="tw-mt-1 tw-text-sm tw-text-[#9C29B2]">Click to upload a picture</p>
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
              {activeTab === "role-specific" && (
                <TabsContent>
                  <div className="tw-space-y-4">{renderRoleSpecificFields()}</div>
                </TabsContent>
              )}
            </Tabs>
            {signupError && (
              <Alert variant="destructive">
                <AlertCircle className="tw-h-5 tw-w-5 tw-text-red-500" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="tw-w-full" disabled={isLoading}>
              {isLoading ? "Signing you up..." : "Join Colorful Kids Daycare !"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

