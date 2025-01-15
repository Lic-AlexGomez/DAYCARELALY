import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/Contactus.css";

const ContactUs = () => {
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

        const { success, error } = await actions.contactUs(
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
        <div style={{ backgroundColor: "#ffffff", padding: "100px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
            <div className="container contact-section">
                <div className="stars">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                </div>

                <h5 className="text-uppercase text-warning">Get in Touch</h5>
                <h2 className="contact-title">Need Help? Let’s Get in Touch</h2>

                {/* Formulario */}
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Your email"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                        />
                    </div>
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Phone Number"
                        />
                    </div>
                    <div className="mt-3">
                        <textarea
                            className="form-control"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Message"
                        ></textarea>
                    </div>

                    {/* Mostrar mensaje de éxito o error */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    {/* Botón de envío */}
                    <div className="mt-4">
                        <button type="submit" className="btn btn-submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
