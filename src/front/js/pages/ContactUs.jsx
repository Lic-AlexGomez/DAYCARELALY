import React from "react";
import "../../styles/ContactUs.css";
import phone from "../../img/phone.png"
import email from "../../img/email.png"
import location from "../../img/location.png"



const ContactUs = () =>{
  return(
    
      <div className="  ">
        <h1 className=" contactus tw-text-4xl tw-font-bold   ">Contact Us</h1>
        <div  className="contactus-container tw-mx-auto tw-w-64  tw-flex tw-justify-start">
        
           <div className="contactInfo tw-w-64 ">
                <h2 className="tw-text-2xl tw-font-bold tw-text-white tw-mx-auto tw-w-max tw-mt-16">Contact information</h2>
                 <p className="paragraphinfo tw-text-white tw-mx-auto tw-w-max">Say something to start a live chat!</p>
                 <div className="info tw-flex tw-justify-center">
                 <ul className="list-reach tw-mt-5 ">
                      <li className="tw-flex tw-items-center tw-space-x-4 tw-mb-4 "><img className="img-phone tw-w-8 tw-h-8 tw-object-cover tw-mr-4" src={phone} alt="arcoiris " /> <p className="tw-text-white">+1012 3456 789</p></li>
                      <li className="tw-flex tw-items-center tw-space-x-4 tw-mb-4" ><img className="img-gmail tw-w-8 tw-h-8 tw-object-cover tw-mr-4 " src={email} alt="arcoiris " /><p className="tw-text-white">demo@gmail.com</p> </li>
                      <li className="tw-flex tw-items-center tw-space-x-4"><img className="img-location tw-w-8 tw-h-8 tw-object-cover tw-mr-4" src={location} alt="arcoiris " /> <p className="tw-text-white">  132 Dartmouth Street Boston,<br/> Massachusetts 02156 United States </p> </li>
                 </ul>
                </div>
           </div>
           
       
      </div>
      </div>
      
   
  )
}

export default ContactUs;