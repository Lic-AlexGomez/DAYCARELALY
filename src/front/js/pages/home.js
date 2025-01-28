import React , {useEffect} from "react";
import { FileUploader } from "../component/uploadToCloudinary.jsx";
import Classes from "../component/Classes.jsx";
import "../../styles/home.css";
import "../../styles/Hero.css";
import Hero from "../component/hero.jsx";
import Getintouch from "../pages/Getintouch.jsx";
import Aday from "../component/Aday.jsx";
import ServicesSection from "../component/services-section.jsx";
import AboutUs from "../component/AboutUs.jsx";


export const Home = () => {
useEffect(() => {
	const body = document.querySelector("body");
	body.style.background = "white";	
}, []);
	return (
		<div className="text-center ">
			<Hero />
			<ServicesSection />
		
	  <AboutUs />
			<Aday/>
			<Classes />
			{/* <FileUploader /> */}
			<Getintouch />
		</div>
	);
};
