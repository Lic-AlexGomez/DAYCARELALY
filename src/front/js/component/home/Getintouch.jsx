import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
// import "../../../styles/Getintouch.css";
import imagen from "../../../img/bgGetinT.png";


const Getintouch = () => {
  const { actions } = useContext(Context)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    phone_number: "",
    message: "",
  })
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all required fields.")
      return
    }
    const { success, error } = await actions.getinTouch(
      formData.name,
      formData.email,
      formData.subject,
      formData.phone_number,
      formData.message,
    )
    if (success) {
      setSuccessMessage("Your message has been sent successfully!")
      setFormData({
        name: "",
        email: "",
        subject: "",
        phone_number: "",
        message: "",
      })
    } else {
      setError(error)
    }
  }

  return (
    <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-white tw-p-4">
      <div
        className="tw-w-full tw-max-w-4xl tw-p-16 tw-relative tw-bg-cover tw-bg-center"
        style={{ backgroundImage: `url(${imagen})` }}
      >
        <div className="tw-text-center">
          <h3 className="tw-text-[#ff9900] tw-text-lg tw-font-black tw-mb-2 tw-tracking-wider tw-animate-twinkle">
            GET IN TOUCH
          </h3>
          <h2 className="tw-text-[#6b2c91] tw-text-3xl tw-font-bold tw-mb-8 tw-font-comic">
            NEEDS HELP? LET'S GET IN TOUCH
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="tw-space-y-4">
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="tw-w-full tw-p-3 tw-border-none tw-rounded-md tw-bg-white tw-bg-opacity-90"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              className="tw-w-full tw-p-3 tw-border-none tw-rounded-md tw-bg-white tw-bg-opacity-90"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="tw-w-full tw-p-3 tw-border-none tw-rounded-md tw-bg-white tw-bg-opacity-90"
              value={formData.subject}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone number"
              className="tw-w-full tw-p-3 tw-border-none tw-rounded-md tw-bg-white tw-bg-opacity-90"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <textarea
            name="message"
            placeholder="Message"
            rows="5"
            className="tw-w-full tw-p-3 tw-border-none tw-rounded-md tw-bg-white tw-bg-opacity-90 tw-resize-none tw-mb-16"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <div className="tw-text-center tw-flex tw-justify-center">
            <button
              type="submit"
              className="tw-px-32 tw-py-3 tw-bg-[#f7941d] tw-text-white tw-rounded-md tw-mx-auto tw-my-0 tw-font-medium hover:tw-bg-[#e88a1b]"
            >
              Submit
            </button>
          </div>
        </form>
        {error && <p className="tw-mt-2 tw-text-sm tw-text-red-600">{error}</p>}
        {successMessage && <p className="tw-mt-2 tw-text-sm tw-text-green-600">{successMessage}</p>}
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-top-10 tw-left-32 tw-text-4xl">★</div>
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-top-16 tw-left-44 tw-text-5xl">★</div>
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-top-24 tw-left-32 tw-text-6xl">★</div>
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-bottom-20 tw-right-24 tw-text-4xl">★</div>
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-bottom-12 tw-right-32 tw-text-6xl">★</div>
        <div className="tw-absolute tw-hidden md:tw-block tw-text-[#ff9900] tw-animate-twinkle tw-bottom-24 tw-right-32 tw-text-5xl">★</div>
      </div>
    </div>
  )
}

export default Getintouch

