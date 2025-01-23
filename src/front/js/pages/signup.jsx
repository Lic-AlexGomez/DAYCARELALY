import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const Signup = () => {
  const { actions } = useContext(Context)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null) 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    profilePicture: null,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    // Parent-specific fields
    childName: "",
    childDateOfBirth: "",
    childAllergies: "",
    emergencyContact: "",
    birthCertificate: null,
    immunizationRecords: null,
    // Teacher-specific fields
    qualifications: "",
    teachingExperience: "",
    certifications: null,
    backgroundCheck: null,
    // Admin-specific fields
    position: "",
    department: "",
  })

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }))
  }

  const handleRoleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setSignupError("Passwords do not match")
      return false
    }
    
    return true
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

        if (profilePictureUrl) {
          setUploadedImageUrl(profilePictureUrl) // Update state with uploaded image URL
        }

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
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
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

  return (
    <div className="tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-bg-gray-100">
      <Card className="tw-w-full tw-max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="account" className="tw-w-full">
              <TabsList className="tw-grid tw-w-full tw-grid-cols-3">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="role">Role</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="tw-space-y-4">
                  <div className="tw-space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
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
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="personal">
                <div className="tw-space-y-4">
                  <div className="tw-space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="tw-space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                  <div className="tw-space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="tw-space-y-2">
                    <Label htmlFor="profilePicture">Profile Picture</Label>
                    <Input
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {uploadedImageUrl && ( 
                      <div className="tw-mt-2">
                        <img
                          src={uploadedImageUrl || "/placeholder.svg"}
                          alt="Uploaded profile picture"
                          className="tw-w-32 tw-h-32 tw-object-cover tw-rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="role">
                <div className="tw-space-y-4">
                  <div className="tw-space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={handleRoleChange} value={formData.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.role === "parent" && (
                    <>
                      <div className="tw-space-y-2">
                        <Label htmlFor="childName">Child's Name</Label>
                        <Input id="childName" name="childName" value={formData.childName} onChange={handleChange} />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="childDateOfBirth">Child's Date of Birth</Label>
                        <Input
                          id="childDateOfBirth"
                          name="childDateOfBirth"
                          type="date"
                          value={formData.childDateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="childAllergies">Child's Allergies</Label>
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
                        />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="birthCertificate">Birth Certificate</Label>
                        <Input id="birthCertificate" name="birthCertificate" type="file" onChange={handleChange} />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="immunizationRecords">Immunization Records</Label>
                        <Input
                          id="immunizationRecords"
                          name="immunizationRecords"
                          type="file"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  {formData.role === "teacher" && (
                    <>
                      <div className="tw-space-y-2">
                        <Label htmlFor="qualifications">Qualifications</Label>
                        <Input
                          id="qualifications"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="teachingExperience">Teaching Experience</Label>
                        <Input
                          id="teachingExperience"
                          name="teachingExperience"
                          value={formData.teachingExperience}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="certifications">Certifications</Label>
                        <Input id="certifications" name="certifications" type="file" onChange={handleChange} />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="backgroundCheck">Background Check</Label>
                        <Input id="backgroundCheck" name="backgroundCheck" type="file" onChange={handleChange} />
                      </div>
                    </>
                  )}
                  {formData.role === "admin" && (
                    <>
                      <div className="tw-space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input id="position" name="position" value={formData.position} onChange={handleChange} />
                      </div>
                      <div className="tw-space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" name="department" value={formData.department} onChange={handleChange} />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            {signupError && <p className="tw-text-red-500 tw-mt-4">{signupError}</p>}
            <Button className="tw-w-full tw-mt-4" type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup

