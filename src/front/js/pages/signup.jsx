import React , { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const signup = () => {
    const { actions, store  } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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
    
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
       
        const { success, error } = await actions.signUp(
          formData.username,
          formData.email,
          formData.password
        );

        if (success) {
            setSuccessMessage("User created successfully. Redirecting to login page...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
            } else {
                setError(error);
            }
        }
        return (
            <div className="container my-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <h1 className="text-center">Create a new account</h1>
                        <h6>It’s quick and easy.</h6>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Sign Up
                            </button>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                        </form>
                    </div>
                </div>
            </div>
        );
 
}

export default signup