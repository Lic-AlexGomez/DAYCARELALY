import React, { useContext, Component, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/footer.css";

import arcoiris from "../../img/lgo.png"
import twitter from "../../img/mdi_twitter.png"
import facebook from "../../img/ic_baseline-facebook.png"
import instagram from "../../img/mdi_instagram.png"
import linkedin from "../../img/ri_linkedin-fill.png"
import phone from "../../img/phone.png"
import mail from "../../img/email.png"
import location from "../../img/location.png"


export const Footer = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState('')
	const [data, setData] = useState([]);
	const handleChangeEmail = (e) => {
		setEmail(e.target.value)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await actions.newsletter(email);
			if (result) {
				alert('You have successfully subscribed to the newsletter');
				setEmail('');
			}
		} catch (error) {
			alert('There was an error when subscribing: ');
		}

	};


useEffect(() => {
  if (store.settings != undefined) {
	setData(store.settings);
  } }, [store.settings]);


	return (

		<footer className="footer">
			<div className="footer-content">

				<div className="about-container">
					<div>
						<strong>ABOUT COMPANY</strong>
						<img className="img-arcoiris" src={data.image? data.image : arcoiris} alt="arcoiris " />

					</div>

					<div className="description-about">
						<p>We provide a safe and stimulating environment
							where children can learn, explore and grow. </p>
					</div>
					<div className="socialmedia-container">

						<div className="twitter"> <a href={data.twitter? data.twitter :"https://x.com/"} ><img className="img-twitter" src={twitter} alt="arcoiris " /></a> </div>
						<div className="facebook"><a href={data.facebook? data.facebook : "https://www.facebook.com/Slime-Factory-110104161303552"}><img className="img-facebook" src={facebook} alt="arcoiris " /></a></div>
						<div className="instagram"><a href={data.instagram? data.instagram : "https://www.instagram.com/slimefactorycol/"}><img className="img-instagram" src={instagram} alt="arcoiris " /></a></div>
						<div className="linkedin"><a href={data.linkedin? data.linkedin : "https://www.linkedin.com" }><img className="img-linkedin" src={linkedin} alt="arcoiris " /></a></div>

					</div>
				</div>

				<div className="services-container">
					<strong>Our Services</strong>
					<ul className="list-services">
						<Link to={"/"}><li>Preschool programs</li></Link>
						<Link to={"/"}><li>online store</li></Link>
						<Link to={"/"}><li>Healthy food </li></Link>
						<Link to={"/"}><li>Child care</li></Link>
						<Link to={"/"}><li>Children´s events</li></Link>
					</ul>
				</div>
				<div className="links-container">
					<strong>Useful links</strong>
					<ul className="list-services">
						<Link to={"/"}><li>About us</li></Link>
						<Link to={"/"}><li>our team</li></Link>
						<Link to={"/"}><li>Privacy policy </li></Link>
						<Link to={"/contactus"}><li>Contact us</li></Link>
						<Link to={"/"}><li>Terms of service</li></Link>
					</ul>
				</div>
				<div className="reachus-container">
					<strong>Reach us</strong>
					<ul className="list-reach">
						<li><img className="img-phone" src={phone} alt="arcoiris " />{data.phone? data.phone : "+1012 3456 789"} </li>
						<li><img className="img-gmail" src={mail} alt="arcoiris " />{data.admin_email? data.admin_email : "demo@gmail.com"} </li>
						<li><img className="img-location" src={location} alt="arcoiris " /> <p> {data.address? data.address : <>"132 Dartmouth Street Boston,"<br /> "Massachusetts 02156 United States"</>}  </p> </li>
					</ul>
				</div>
				<div className="newsletter-container">
					<strong>Join our newsletter</strong>
					<form className="form-newsletter" onSubmit={handleSubmit} >
						<input className="input-newsletter" type="email" placeholder="Your email address" name="email" value={email} onChange={handleChangeEmail} />
						<button className="button-newsletter" type="submit">Subscribe</button>
					</form>
					<p className="p-newsletter">*  Will send you weekly updates for your better tool management.</p>

				</div>

			</div>
			<hr></hr>
			<div className="info-container">
				<p>© 2025 Daycare . Todos los derechos reservados.</p>
			</div>
		</footer>
	);

}

