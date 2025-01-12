import React, { Component } from "react";
import "../../styles/footer.css";

import arcoiris from "../../img/arcoiris2.png"
import twitter from "../../img/mdi_twitter.png"
import facebook from "../../img/ic_baseline-facebook.png"
import instagram from "../../img/mdi_instagram.png"
import linkedin from "../../img/ri_linkedin-fill.png"


export const Footer = () => (
	<footer className="footer">
		<div className="footer-content">

			<div className="about-container">
				<div>
					<strong>ABOUT COMPANY</strong>
					 {/* <img className="img-arcoiris" src={arcoiris} alt="arcoiris " />  */}
					
				</div>
				
				<div className="description-about">
					<p>We provide a safe and stimulating environment
				   where children can learn, explore and grow. </p>
			   </div>
			   <div className="socialmedia-container">
				<div className="twitter"><img className="img-twitter" src={twitter} alt="arcoiris " /></div>
				<div className="facebook"><img className="img-facebook" src={facebook} alt="arcoiris " /></div>
				<div className="instagram"><img className="img-instagram" src={instagram} alt="arcoiris " /></div>
				<div className="linkedin"><img className="img-linkedin" src={linkedin} alt="arcoiris " /></div>
				
			   </div>
		    </div>
				
			<div className="services-container">
				<strong>Our Services</strong>
				<ul className="list-services">
					<li>Preschool programs</li>
					<li>online store</li>
					<li>Healthy food </li>
					<li>Child care</li>
					<li>Children´s events</li>
				</ul>
			</div>
			<div className="links-container">
				<strong>Useful links</strong>
				<ul className="list-services">
					<li>About us</li>
					<li>our team</li>
					<li>Privacy policy </li>
					<li>Contact us</li>
					<li>Terms of service</li>
				</ul>
			</div>
			<div className="reachus-container">
				<strong>Reach us</strong>
			</div>
			<div className="newsletter-container">
				<strong>Join our newsletter</strong>
			</div>

		</div>
		<div className="info-container">
			<p>© 2025 Daycare. Todos los derechos reservados.</p>
		</div>
	</footer>
);
