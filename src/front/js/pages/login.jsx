import React, {  useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate,Link } from "react-router-dom";
import { Navbar } from "../component/navbar";
import image4 from "../../img/image-4.png"
import image5 from "../../img/image-5.png";
import image6 from "../../img/image-6.png";
import image7 from "../../img/image-7.png"


const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [dataLogin ,setDataLogin] = useState({
        "email":"",
        "password":""
    })

    const handleChangeLogin = (e)=>{
        const{name,value} = e.target
        setDataLogin(prevData =>({
        ...prevData,[name]:value

        }))
    }
   
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await actions.login( dataLogin.email, dataLogin.password);
            if (result ) {
                navigate(`/`);
            }
        } catch (error) {
            console.error("Error", error);
        }
    };
    return (
        <>
            <form className="form" onSubmit={handleLogin}>
                <p className="form-title">Sign in to your account</p>
                <div className="input-container">
                    <p className="Email">Email</p>
                    <input type="email" name="email" placeholder="Enter email" value={dataLogin.email} onChange={handleChangeLogin}/>
                    <span>
                    </span>
                </div>
                <div className="input-container">
                    <p className="Password">Password</p>
                    <input type="password" name="password" placeholder="Enter password" value={dataLogin.password} onChange={handleChangeLogin} />
                </div>
                <button type="submit" className="submit">
                    Sign in
                </button>

                <p className="signup-link">
                    No account?
                    <Link to={"/signup"}> Sign up</Link>
                </p>
                <p className="signup-link">
                    <Link to={""}> forgot password?</Link>
                </p>

            </form>
            {/* <div className="img-container">
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
            </div> */}





        </>
    )



}
export default Login;