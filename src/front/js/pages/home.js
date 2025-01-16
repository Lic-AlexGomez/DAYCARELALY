import React from "react";
import { FileUploader } from "../component/uploadToCloudinary.jsx";
import Classes from "../component/Classes.jsx";
import "../../styles/home.css";
import "../../styles/Hero.css";
import Hero from "../component/hero.jsx";
import Getintouch from "../pages/Getintouch.jsx";

export const Home = () => {

	return (
		<div className="text-center ">
			<Hero />
			<Classes />
			{/* <FileUploader /> */}
			<Getintouch />
		</div>
	);
};
