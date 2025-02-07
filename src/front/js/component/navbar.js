// import React from "react";
// import { Link } from "react-router-dom";

// export const Navbar = () => {
// 	return (
// 		<nav className="navbar navbar-light bg-light">
// 			<div className="container">
// 				<Link to="/">
// 					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
// 				</Link>
// 				<div className="ml-auto">
// 					<Link to="/demo">
// 						<button className="btn btn-primary">Check the Context in action</button>
// 					</Link>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// };
import React, { useState,useEffect } from "react";
import { Search } from "lucide-react";
import "../../styles/Navbar.css";
import imagen from "../../img/lgo.png";
import facebook from "../../img/Facebook.png";
import instagram from "../../img/Instagram.png";
import whatsapp from "../../img/Whatsapp.png";
import underNav from "../../img/underNav.png";
import { Link } from "react-router-dom";


export const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
useEffect (() => {
 
    const header = document.querySelector(".underNav");
    
      header.classList.add("position-absolute");
  
}
, []);

  return (
	<>	<div className="headerWrapper container-fluid">
      <header className="headerContainer container">
    
        <div className="topRow">
          <div className="logoContainer">
            <img
              src={imagen}
              alt="Logo"
              className="logo"
            />
          </div>
          <div className="searchContainer me-5">
            <input
              type="search"
              placeholder="Search..."
              className="searchInput"
            />
            <button className="searchButton  pb-2">
              <Search />
            </button>
          </div>
          <div className="socialIcons me-4">
            <a
			  href="https://www.facebook.com/Slime-Factory-110104161303552"
			  target="_blank"
			  rel="noopener noreferrer"
			  className="icon facebook-icon ms-2"
			  title="Visit our Facebook page"
			>
			<img src={facebook} alt="Facebook" />											
			</a>

			<a
				href="https://www.instagram.com/slimefactorycol/"
				target="_blank"
				rel="noopener noreferrer"
				className="icon instagram-icon ms-2"
				title="Visit our Instagram page"
			>
			<img src={instagram} alt="Instagram" />
			</a>				
															

            <a
              href="https://wa.me/573113028888"
              target="_blank"
              rel="noopener noreferrer"
              className="icon whatsapp-icon ms-2"
              title="Contact us on WhatsApp"
            >
              <img src={whatsapp} alt="WhatsApp" />
            </a>
			

          </div>
          {/* <div className="cartContainer">
            <ShoppingCart className="icon cartIcon" />
            <span className="cartCount">2</span>
          </div> */}
        
        </div>

       
        <div className="bottomRow d-flex justify-content-between align-items-center">
          
          <ul className="navLinks">
            <li className="navLink"><Link className="navLink" to="/home">Home</Link></li>
            <li
              className="navLink dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              Slime Shop
              {isDropdownOpen && (
                <ul className="dropdownMenu">
                  <li className="dropdownItem">Store</li>
                  <li className="dropdownItem">ShoppingCart</li>
                  <li className="dropdownItem">All Products</li>
                </ul>
              )}
            </li>
            <li className="navLink"><Link className="navLink" to="/services">Services</Link></li>
            <li className="navLink"><Link className="navLink" to="/gallery">Gallery</Link></li>
            <li className="navLink"><Link className="navLink" to="/programs">Programs</Link></li>
            <li className="navLink"><Link className="navLink" to="/events">Events</Link></li>
            <li className="navLink"><Link className="navLink" to="/about_us">About</Link></li>
            <li className="navLink"><Link className="navLink" to="/contactus">Contact Us</Link></li>

          </ul>
          <div className="authButtons me-5  col-3">
		  	<Link to="/login">
          	  <button className="loginBtn" >Log In</button>
			</Link>
			<Link to="/signup" className="">
           	 <button className="joinBtn ">Join Now</button>
			</Link>
     
          </div>
        </div>
      </header>
    
    </div>
	<img src={underNav} alt="Under Navigation" className="underNav " />
	</>
    
  );
};


