import React , {useEffect} from "react";
import { FileUploader } from "../component/uploadToCloudinary.jsx";
import Classes from "../component/Classes.jsx";
import "../../styles/home.css";
import "../../styles/Hero.css";
import Hero from "../component/hero.jsx";
import Getintouch from "../pages/Getintouch.jsx";
import Aday from "../component/Aday.jsx";
import ServicesSection from "../component/services-section.jsx";

export const Home = () => {
useEffect(() => {
	const body = document.querySelector("body");
	body.style.background = "white";	
}, []);
	return (
		<div className="text-center ">
			<Hero />
			<ServicesSection />
			<div
        className="tw-relative tw-bottom-0 tw-left-0 tw-right-0 tw-w-full tw-h-24 tw-bg-no-repeat tw-bg-cover tw-bg-bottom "
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2033-a1vFfuM38zwl6eMl8d5uyye5mKMxih.png')`,
        }}
      />
			<Aday/>
			<Classes />
			{/* <FileUploader /> */}
			<Getintouch />
		</div>
	);
};
