import React from "react";
//views
import Login from "./login.jsx";
import { FileUploader } from "../component/uploadToCloudinary.jsx";

export const Home = () => {

	return (
		<div className="text-center mt-5">
			{/* <Login/> */}
			<FileUploader />
		</div>
	);
};
