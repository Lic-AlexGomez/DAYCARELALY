// npm i webpack-dev-server --save-dev --legacy-peer-deps
// CLOUDINARY_CLOUD_NAME=dac1grfei CLOUDINARY_API_KEY=428724195757672 CLOUDINARY_API_SECRET=KSSKV54mHWSMw9ZFcb7ppnARcDI
// admin@daycare.com
// admin123
import React, { useEffect } from "react";
import { FileUploader } from "../component/uploadToCloudinary.jsx";
import Classes from "../component/home/Classes.jsx";
import "../../styles/home.css";
import "../../styles/Hero.css";
import Hero from "../component/home/hero.jsx";
import Getintouch from "../component/home/Getintouch.jsx";
import Aday from "../component/home/Aday.jsx";
import ServicesSection from "../component/home/services-section.jsx";
import AboutUs from "../component/home/AboutUs.jsx";
import EducationalPrograms from "../component/home/EducationalPrograms.jsx";
import Statistics from "../component/home/Statistics.jsx";
import PayPalButton from "../component/PayPalButton.jsx";


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
			<Aday />
			<Classes />
			<EducationalPrograms />
			<Statistics />
			<PayPalButton />
			<Getintouch />
		</div>
	);
};
