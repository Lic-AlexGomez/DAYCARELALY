import React, { useEffect, useState,useContext } from "react";
import "../../../styles/Hero.css";
import underNav from "../../../img/RectangleBoth.png";
import image4 from "../../../img/image-4.png"
import image5 from "../../../img/image-5.png";
import image6 from "../../../img/image-6.png";
import image7 from "../../../img/image-7.png"
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import es from "../../lang/es-ES.json";
import en from "../../lang/en-US.json";

const Hero = () => {
  const { store} = useContext(Context);
  const [data, setData] = useState({})
  useEffect(() => {
    if (store.settings !== undefined) {
      setData(store.settings)
    }
  }, [store.settings])
  return (
    <>
      <div className="home-container d-flex justify-content-space-between align-items-start" >
        <section className="hero  flex-row justify-content-center align-items-start">
          <div className="hero-content ">
            <div className="styled-text">
             {store.lang = "en"? en.hero.title : es.hero.title }  {data.name_daycare ? data.name_daycare : "Laly"} <br />
             {store.lang = "en"? en.hero.subtitle : es.hero.subtitle } 
            </div>
            <p className="styled-text-p"> {store.lang = "en"? en.hero.description : es.hero.description } 
            </p>
            <Link to="/signup" className="cta-button ">{store.lang = "en"? en.hero.btn : es.hero.btn }</Link>
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
