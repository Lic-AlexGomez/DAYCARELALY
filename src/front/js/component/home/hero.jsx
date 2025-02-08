import React, { useEffect, useState } from "react";
import "../../../styles/Hero.css";
import underNav from "../../../img/RectangleBoth.png";
import image4 from "../../../img/image-4.png"
import image5 from "../../../img/image-5.png";
import image6 from "../../../img/image-6.png";
import image7 from "../../../img/image-7.png"
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";

const Hero = () => {
  const { store} = React.useContext(Context);
  const [data, setData] = useState({})
  useEffect(() => {
    if (store.settings !== undefined) {
      setData(store.settings)
    }
  }, [store.settings])
  return (
    <>
      <div className="home-container d-flex justify-content-space-between align-items-start">
        <section className="hero  flex-row justify-content-center align-items-start">
          <div className="hero-content ">
            <div className="styled-text">
              Welcome to  {data.name_daycare ? data.name_daycare : "Alex"} <br />
              Rainbow Slime CO.
            </div>
            <p className="styled-text-p">Where Every Child Shines Bright!
              Our Daycare  provides a nurturing and educational environment for children to grow and thrive. We offer a variety of activities designed to stimulate young minds and encourage creativity. Our experienced staff is dedicated to ensuring each child feels safe, happy, and valued. 
            </p>
            <Link to="/signup" className="cta-button ">Enroll Now</Link>
          </div>
          <div className="image-container ">
            <div className="row img-row">
              <img src={image5} alt="Image 2" className="hero-image Image_2" />
              <img src={image6} alt="Image 3" className="hero-image Image_3" />
            </div>
            <div className="row img-row">
              <img src={image7} alt="Image 4 " className="hero-image Image_4 w-25" />
              <img src={image4} alt="Image 1" className="hero-image Image_1" />
            </div>
          </div>
        </section >
        <img src={underNav} alt="Under Navigation" className="hero-background" />
      </div>

    </>

  );
};

export default Hero;
