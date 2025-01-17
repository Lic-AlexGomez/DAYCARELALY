import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/Getintouch.css";
import imagen from "../../img/bgGetinT.png";

const Getintouch = () => {
    const { actions, store } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        phone_number: "",
        message: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        // Validaciones básicas
        if (!formData.name || !formData.email || !formData.message) {
            setError("Please fill out all required fields.");
            return;
        }

        const { success, error } = await actions.getinTouch(
            formData.name,
            formData.email,
            formData.subject,
            formData.phone_number,
            formData.message
        );

        if (success) {
            setSuccessMessage("Your message has been sent successfully!");
            setFormData({ name: "", email: "", subject: "", phone_number: "", message: "" });
        } else {
            setError(error);
        }
    };

    return (
        <div className="contact-container">
          <div className="form-container" style={{ backgroundImage:`url(${imagen})` }}>
            {/* Stars top left */}
            <span className="star star-1 ">★</span>
            <span className="star star-2">★</span>
            <span className="star star-3">★</span>
            
            {/* Stars bottom right */}
            <span className="star star-4">★</span>
            <span className="star star-5">★</span>
            <span className="star star-6">★</span>
    
            <div className="get-in-touch ">GET IN TOUCH</div>
            <h2 className="main-title">Needs Help? Let's Get in Touch</h2>
    
            <form>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Your name"
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="form-input"
                />
              </div>
              
              <textarea
                placeholder="Message"
                className="form-textarea"
              />
    
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )
    }

export default Getintouch;
