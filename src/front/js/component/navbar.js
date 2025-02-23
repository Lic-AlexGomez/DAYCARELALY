import React, { useState, useEffect, useContext } from "react";
import { Search } from "lucide-react";
import "../../styles/Navbar.css";
import logoImage from "../../img/lgo.png";
import facebookIcon from "../../img/Facebook.png";
import instagramIcon from "../../img/Instagram.png";
import whatsappIcon from "../../img/Whatsapp.png";
import underNavImage from "../../img/underNav.png";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Navbar = () => {
  const { store, actions } = useContext(Context)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const header = document.querySelector(".underNav")
    header.classList.add("position-absolute")
  }, [])

  useEffect(() => {
    if (store.settings !== undefined) {
      setData(store.settings)
    }
  }, [store.settings])
console.log(store.settings)
  return (
    <>
      <div className="headerWrapper container-fluid">
        <header className="headerContainer container">
          <div className="topRow">
            <div className="logoContainer">
              <img src={data.image || logoImage} alt="Logo" className="logo" />
              
            </div>
            {/* <div className="searchContainer sm:me-5 sm-tw-mr-10">
              <input type="search" placeholder="Search..." className="searchInput" />
              <button className="searchButton pb-2">
                <Search />
              </button>
            </div> */}
            <div className="socialIcons me-4">
              <a
                href={data.facebook || "https://www.facebook.com/Slime-Factory-110104161303552"}
                target="_blank"
                rel="noopener noreferrer"
                className="icon facebook-icon ms-2"
                title="Visit our Facebook page"
              >
                <img src={facebookIcon || " "} alt="Facebook" />
              </a>
              <a
                href={data.instagram || "https://www.instagram.com/slimefactorycolombia/"}
                target="_blank"
                rel="noopener noreferrer"
                className="icon instagram-icon ms-2"
                title="Visit our Instagram page"
              >
                <img src={instagramIcon || " "} alt="Instagram" />
              </a>
              <a
                href={data.whatsapp || "https://wa.me/573104000000"}
                target="_blank"
                rel="noopener noreferrer"
                className="icon whatsapp-icon ms-2"
                title="Contact us on WhatsApp"
              >
                <img src={whatsappIcon || " "} alt="WhatsApp" />
              </a>
            </div>
          </div>

          <div className="bottomRow d-flex justify-content-between align-items-center">
            <ul className="navLinks">
              <li className="navLink">
                <Link to="/home">Home</Link>
              </li>
              {/* <li
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
              </li> */}
              {/* <li className="navLink">
                <Link to="/services">Services</Link>
              </li> */}
              <li className="navLink">
                <Link to="/gallery">Gallery</Link>
              </li>
              {/* <li className="navLink">
                <Link to="/programs">Programs</Link>
              </li>
              <li className="navLink">
                <Link to="/events">Events</Link>
              </li> */}
              <li className="navLink">
                <Link to="/about_us">About</Link>
              </li>
              <li className="navLink">
                <Link to="/contactus">Contact Us</Link>
              </li>
            </ul>
            {/* <div className="authButtons sm:tw-mr-5 col-3 tw-flex sm:tw-justify-end tw-justify-center"> */}
              {/* <Link to="/login">
                <button className="loginBtn">Log In</button>
              </Link> */}
              {/* <Link to="/signup" className="">
                <button className="joinBtn">Join Now</button>
              </Link> */}
            {/* </div> */}
          </div>
        </header>
      </div>
      <img src={underNavImage || " "} alt="Under Navigation" className="underNav" />
    </>
  )
}

