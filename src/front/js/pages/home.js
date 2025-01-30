// npm i webpack-dev-server --save-dev --legacy-peer-deps
// CLOUDINARY_CLOUD_NAME=dac1grfei CLOUDINARY_API_KEY=428724195757672 CLOUDINARY_API_SECRET=KSSKV54mHWSMw9ZFcb7ppnARcDI
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
import EducationalPrograms from "../component/EducationalPrograms.jsx";
import Statistics from "../component/Statistics.jsx";


export const Home = () => {
useEffect(() => {
	const body = document.querySelector("body");
	body.style.background = "white";	
}, []);
	return (
		<div className="text-center ">
			
			<Hero />
			{/* <FileUploader /> */}
			<ServicesSection />
		
	  <AboutUs />
			<Aday/>
			<Classes />
			<EducationalPrograms />
			
			
			<Statistics />
			<Getintouch />
		</div>
	);
};
