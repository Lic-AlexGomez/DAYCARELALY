import React, { useState } from "react"

// import { useAuth } from "../Auth"

const TeacherProfile = () => {

  const [name, setName] = useState("alex")
  const [email, setEmail] = useState("alex@gmail.com")
  const [subject, setSubject] = useState("N/A" || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }

  return (
    <div className="tw-max-w-xl tw-mx-auto">
      <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Teacher Profile</h2>
      <form onSubmit={handleSubmit} className="tw-space-y-4">
        <div>
          <label htmlFor="name" className="tw-block tw-mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="tw-block tw-mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
          />
        </div>
        <div>
          <label htmlFor="subject" className="tw-block tw-mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded"
          />
        </div>
        <button type="submit" className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default TeacherProfile

