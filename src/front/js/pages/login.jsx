import React from "react";
import image4 from "../../img/image-4.png"
import image5 from "../../img/image-5.png";
import image6 from "../../img/image-6.png";
import image7 from "../../img/image-7.png"
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <form className="form">
                <p className="form-title">Sign in to your account</p>
                <div className="input-container">
                    <input type="email" placeholder="Enter email" />
                    <span>
                    </span>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Enter password" />
                </div>
                <button type="submit" className="submit">
                    Sign in
                </button>

                <p className="signup-link">
                    No account?
                    <Link to={""}> Sign up</Link>
                </p>
                <p className="signup-link">
                    <Link to={""}> forgot password?</Link>
                </p>

            </form>
            <div className="img-container">
                <div className="img7">
                    <img src={image7} alt="osito " />
                </div>


                <div className="img6">
                    <img src={image6} alt=" niños " />
                </div>
                <div className="img5">
                    <img src={image5} alt=" niña " />
                </div>
                <div className="img4">
                    <img src={image4} alt=" niña " />
                </div>
            </div>





        </>
    )



}
export default Login;