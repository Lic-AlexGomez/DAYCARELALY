import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/ContactUs.css";
import phone from "../../img/phone.png";
import Swal from "sweetalert2";
import avion from "../../img/avion.png";
import email from "../../img/email.png";
import location from "../../img/location.png";
import twitter from "../../img/mdi_twitter.png";
import facebook from "../../img/ic_baseline-facebook.png";
import instagram from "../../img/mdi_instagram.png";

const ContactUs = () => {
  const { actions, store } = useContext(Context);
  

  const [dataContactUs, setDataContactUs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    phone_number: "",
    message: "",
  });

  const handleChangeform = (e) => {
    const { name, value } = e.target;
    setDataContactUs({ ...dataContactUs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (
      !dataContactUs.first_name ||
      !dataContactUs.last_name ||
      !dataContactUs.email ||
      !dataContactUs.phone_number ||
      !dataContactUs.message ||
      !dataContactUs.subject
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please complete all fields before submitting.",
      });
      return;
    }

  
    const confirmSubmit = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send the message?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send it!",
      cancelButtonText: "No, cancel",
    });

    if (!confirmSubmit.isConfirmed) {
      return;
    }

    try {
      const result = await actions.contactUs(
        dataContactUs.first_name,
        dataContactUs.last_name,
        dataContactUs.email,
        dataContactUs.subject,
        dataContactUs.phone_number,
        dataContactUs.message
      );

      if (result) {
        Swal.fire({
          icon: "success",
          title: "Message Sent",
          text: "An advisor will contact you!.",
        });

        setDataContactUs({
          first_name: "",
          last_name: "",
          email: "",
          subject: "",
          phone_number: "",
          message: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `There was an error: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "There was an error submitting the form. Please try again.",
      });
    }
  };

  return (
    <div className="container-form">
      <h1 className="contactus tw-text-4xl tw-font-bold">Contact Us</h1>
      <p className="anyquestion tw-mx-auto tw-w-70 tw-flex tw-justify-center">
        Any question or remarks? Just write us a message!
      </p>
      <div className="contactus-container tw-mx-auto tw-w-64 tw-flex tw-justify-start">
        <div className="contactInfo tw-w-64">
          <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-ml-7 tw-w-max tw-mt-16">
            Contact information
          </h2>
          <p className="paragraphinfo tw-text-white tw-ml-7 tw-w-max">
            Say something to start a live chat!
          </p>
          <div className="info tw-flex tw-mt-20">
            <ul className="list-reachForm">
              <li className="phone tw-flex tw-items-center tw-space-x-4 tw-mb-8 ">
                <img
                  className="img-phone tw-w-8 tw-h-8 tw-object-cover tw-ml-6"
                  src={phone}
                  alt="phone "
                />
                <p className="tw-text-white">+1012 3456 789</p>
              </li>
              <li className="gmail tw-flex tw-items-center tw-space-x-4 tw-mb-4 tw-mb-8">
                <img
                  className="img-gmail tw-w-8 tw-h-8 tw-object-cover tw-ml-6 "
                  src={email}
                  alt="email "
                />
                <p className="tw-text-white">demo@gmail.com</p>
              </li>
              <li className="location tw-flex tw-items-center tw-space-x-4">
                <img
                  className="img-location tw-w-8 tw-h-8 tw-object-cover tw-ml-6"
                  src={location}
                  alt="location "
                />
                <p className="tw-text-white">
                  132 Dartmouth Street Boston,
                  <br /> Massachusetts 02156 United States
                </p>
              </li>
            </ul>
          </div>
          <div className="socialmedia tw-flex">
            <div className="twitter-form">
              {" "}
              <a href="https://x.com/">
                <img className="img-twitter" src={twitter} alt="arcoiris " />
              </a>{" "}
            </div>
            <div className="facebook-form">
              <a href="https://www.facebook.com/Slime-Factory-110104161303552">
                <img className="img-facebook" src={facebook} alt="arcoiris " />
              </a>
            </div>
            <div className="instagram-form">
              <a href="https://www.instagram.com/slimefactorycol/">
                <img className="img-instagram" src={instagram} alt="arcoiris " />
              </a>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-container tw-p-10">
              <div className="tw-flex tw-space-x-24 ">
                <div className="firstName tw-space-y-2 tw-flex-1 ">
                  <label className="labelFirstName tw-block">First Name</label>
                  <input
                    className="inputFirstName tw-block tw-p-2  tw-w-64"
                    type="text"
                    name="first_name"
                    value={dataContactUs.first_name}
                    onChange={handleChangeform}
                  />
                </div>

                <div className="lastName tw-space-y-2 tw-flex-1 ">
                  <label className="labelLastName tw-block">Last Name</label>
                  <input
                    className="inputLastName tw-block tw-p-2 tw-w-64 m"
                    type="text"
                    name="last_name"
                    value={dataContactUs.last_name}
                    onChange={handleChangeform}
                  />
                </div>
              </div>
              <div className="tw-flex tw-justify-center tw-space-x-24 ">
                <div className="email tw-mt-10 tw-space-y-2 tw-flex-1 ">
                  <label className="labelEmail tw-block">email</label>
                  <input
                    className="inputEmail tw-block tw-p-2 tw-w-64"
                    type="email"
                    name="email"
                    value={dataContactUs.email}
                    onChange={handleChangeform}
                  />
                </div>

                <div className="phone tw-mt-10 tw-space-y-2 tw-flex-1 ">
                  <label className="labelPhone tw-block">Phone number</label>
                  <input
                    className="inputPhone tw-block tw-p-2 tw-w-64"
                    type="text"
                    name="phone_number"
                    value={dataContactUs.phone_number}
                    onChange={handleChangeform}
                  />
                </div>
              </div>
            </div>

            <div className="selectObject">
              <h1 className="selectSubject tw-ml-10">
                <strong>Select Subject?</strong>
              </h1>
              <div className="tw-flex">
                <div className="GenerarInquey tw-mt-5 tw-ml-10">
                  <label className="tw-inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="inputGeneralInquery tw-mr-2"
                      name="subject"
                      value="General Inquiry"
                      onChange={handleChangeform}
                    />
                    <span>General Inquiry</span>
                  </label>
                </div>

                <div className="techsolutions tw-mt-5 tw-ml-10">
                  <label className="tw-inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="inputTechnical tw-mr-2"
                      name="subject"
                      value="Technical"
                      onChange={handleChangeform}
                    />
                    <span>Technical </span>
                  </label>
                </div>
                <div className="product support tw-mt-5 tw-ml-5">
                  <label className="tw-inline-flex items-center space-x-2">
                    <input
                      type="radio"
                      className="inputproducts tw-mr-2"
                      name="subject"
                      value="Products"
                      onChange={handleChangeform}
                    />
                    <span>Products</span>
                  </label>
                </div>
                <div className="commercialconsulting tw-mt-5 tw-ml-5">
                  <label className="tw-inline-flex items-center ">
                    <input
                      type="radio"
                      className="inpucommercialconsulting tw-mr-2"
                      name="subject"
                      value="Commercial"
                      onChange={handleChangeform}
                    />
                    <span>Commercial Consulting</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <div className="message-container tw-flex tw-flex-col tw-ml-10 tw-mr-5">
                <label className="message tw-mt-10">Message</label>
                <input
                  className="inputPhone tw-block tw-p-2 tw-w-full tw-mt-2"
                  type="text"
                  name="message"
                  value={dataContactUs.message}
                  onChange={handleChangeform}
                />
              </div>
              <div className="button-container">
                <button type="submit" className="sendButton">
                  Send Message
                </button>
              </div>

              <div className="img-avion">
                <img src={avion} alt="" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
