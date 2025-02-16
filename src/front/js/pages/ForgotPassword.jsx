import React, { useState, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Context } from "../store/appContext"
import { Link } from "react-router-dom"

const Button = ({ className, children, ...props }) => (
  <button
    className={`tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:opacity-50 tw-disabled:pointer-events-none tw-ring-offset-background tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90 tw-h-10 tw-py-2 tw-px-4 ${className}`}
    {...props}
  >
    {children}
  </button>
)

const ExclamationTriangleIcon = (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
)

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:cursor-not-allowed tw-disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  )
})

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`tw-text-sm tw-font-medium tw-leading-none tw-peer-disabled:cursor-not-allowed tw-peer-disabled:opacity-70 ${className}`}
    {...props}
  />
))

const Card = ({ className, ...props }) => (
  <div className={`tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm ${className}`} {...props} />
)

const CardHeader = ({ className, ...props }) => (
  <div className={`tw-flex tw-flex-col tw-space-y-1.5 tw-p-6 ${className}`} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3 className={`tw-text-2xl tw-font-semibold tw-leading-none tw-tracking-tight ${className}`} {...props} />
)

const CardDescription = ({ className, ...props }) => (
  <p className={`tw-text-sm tw-text-muted-foreground ${className}`} {...props} />
)

const CardContent = ({ className, ...props }) => <div className={`tw-p-6 tw-pt-0 ${className}`} {...props} />

const CardFooter = ({ className, ...props }) => (
  <div className={`tw-flex tw-items-center tw-p-6 tw-pt-0 ${className}`} {...props} />
)

const Alert = ({ className, variant = "default", ...props }) => (
  <div
    role="alert"
    className={`tw-rounded-lg tw-border tw-p-4 ${variant === "destructive"
        ? "tw-border-destructive/50 tw-text-destructive dark:tw-border-destructive [&>svg]:tw-text-destructive"
        : "tw-text-foreground"
      } ${className}`}
    {...props}
  />
)

const AlertTitle = ({ className, ...props }) => (
  <h5 className={`tw-mb-1 tw-font-medium tw-leading-none tw-tracking-tight ${className}`} {...props} />
)

const AlertDescription = ({ className, ...props }) => (
  <div className={`tw-text-sm [&_p]:tw-leading-relaxed ${className}`} {...props} />
)

const ForgotPassword = () => {
  const { actions } = useContext(Context)
  const navigate = useNavigate()
  const { token } = useParams()
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleChangePassword = (e) => {
    setNewPassword(e.target.value)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!newPassword) {
      setError("Please enter a new password.")
      return
    }

    try {
      const response = await actions.changePassword(token, newPassword)

      if (response.success) {
        setSuccessMessage("Your password has been reset successfully!")
        setError(null)
        setNewPassword("") // Reset password field
      } else {
        setError(response.message || "There was an error resetting your password.")
      }
    } catch (error) {
      console.error("Password reset failed", error)
      setError("There was a problem resetting your password. Please try again.")
    }
  }

  // Navigate to the login page after successful password reset
  const handleLoginRedirect = () => {
    navigate("/login")
  }

  return (
    <div className="tw-container tw-mx-auto tw-flex tw-items-center tw-justify-center tw-min-h-screen tw-px-4">
      <Card className="tw-w-full tw-max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword}>
            <div className="tw-space-y-4">
              <div className="tw-space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={handleChangePassword}
                  required
                  disabled={successMessage}  // Disable input when successMessage exists
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="tw-mt-4">
                <ExclamationTriangleIcon className="tw-h-4 tw-w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="tw-mt-4">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            <div className="tw-flex tw-items-center tw-justify-between tw-mt-4">
              {/* Change button text to "Log In" after success */}
              <Button
                type="submit"
                className="tw-mx-auto tw-mt-4 border tw-bg-primary hover:tw-bg-purple-600 hover:tw-text-white"
              >
                {successMessage ? (
                  <span onClick={handleLoginRedirect}>Log In</span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="tw-flex tw-flex-col tw-space-y-2">
          {!successMessage && (
            <Link to="/login" className="tw-text-sm tw-text-blue-500 hover:tw-underline">
              Remembered your password? Sign in
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default ForgotPassword
