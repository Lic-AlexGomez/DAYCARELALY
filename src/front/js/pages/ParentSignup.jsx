import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { AlertCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Alert,
  AlertTitle,
  AlertDescription,
  validateCommonFields,
  renderProfilePictureUpload,
} from "./SignupCommon"

export const ParentSignup = () => {
  const { actions } = useContext(Context)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    childName: "",
    childDateOfBirth: "",
    childAllergies: "",
    emergencyContact: "",
    birthCertificate: null,
    immunizationRecords: null,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setSignupError] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }))
  }

  const validateForm = () => {
    const formErrors = validateCommonFields(formData)
    if (!formData.childName.trim()) formErrors.childName = "Child's name is required"
    if (!formData.childDateOfBirth) formErrors.childDateOfBirth = "Child's date of birth is required"
    if (!formData.emergencyContact.trim()) formErrors.emergencyContact = "Emergency contact is required"
    if (!formData.birthCertificate) formErrors.birthCertificate = "Birth certificate is required"
    if (!formData.immunizationRecords) formErrors.immunizationRecords = "Immunization records are required"
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
        const birthCertificateUrl = await actions.uploadToCloudinary(formData.birthCertificate)
        const immunizationRecordsUrl = await actions.uploadToCloudinary(formData.immunizationRecords)

        const signupData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "parent",
          profilePicture: profilePictureUrl,
          childName: formData.childName,
          childDateOfBirth: formData.childDateOfBirth,
          childAllergies: formData.childAllergies,
          emergencyContact: formData.emergencyContact,
          birthCertificateUrl,
          immunizationRecordsUrl,
        }

        const response = await actions.signUp(signupData)
        if (response.success) {
          navigate("/dashboard")
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

  return (
    <div className="tw-mt-3 tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-b tw-from-[#FFC909] tw-to-[#a16bac] tw-px-4">
      <Card className="tw-my-14 tw-w-full tw-max-w-2xl tw-bg-white tw-bg-opacity-90">
        <CardHeader>
          <CardTitle>Welcome to Colorful Kids Daycare!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="tw-space-y-6">
            <div className="tw-space-y-4">
              <div className="tw-space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
                {errors.username && <p className="tw-text-sm tw-text-red-500">{errors.username}</p>}
              </div>
              <div className="tw-space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
              {renderProfilePictureUpload(formData, handleChange)}
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
                {errors.immunizationRecords && (
                  <p className="tw-text-sm tw-text-red-500">{errors.immunizationRecords}</p>
                )}
              </div>
            </div>
            {signupError && (
              <Alert variant="destructive">
                <AlertCircle className="tw-h-5 tw-w-5 tw-text-red-500" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{signupError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="tw-w-full" disabled={isLoading}>
              {isLoading ? "Signing you up..." : "Join Colorful Kids Daycare!"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

