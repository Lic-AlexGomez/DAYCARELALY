import React from "react";
import ninoJugando from "../../img/niñoJugando.png";
import onlineStore from "../../img/onlineStore.png";
import Healthyfood from "../../img/Healthyfood.png";
import KidsExcercise from "../../img/KidsExcercise.png";
import events from "../../img/events.png";
import '../../styles/Services.css'
import { Link } from "react-router-dom";


const Services = () => {

    const allServices = [
        {
            id: 1,
            title: "Preschool Programs",
            description: "We offer a comprehensive approach to learning, where children develop social, language, and mathematical skills through games and interactive activities.",
            image: ninoJugando
        },
        {
            id: 2,
            title: " Online Store",
            description: "Visit Our online store and find a variety of educational material, educational toys and products designed for the development of children",
            image: onlineStore
        },
        {
            id: 3,
            title: "Healthy Food Services",
            description: "We offer nutritious and balanced menus, adapted to the nutritional needs of children.",
            image: Healthyfood
        },
        {
            id: 4,
            title: "Personalized Child Care",
            description: "We have a team of professionals trained to provide personalized care and attention to each child.",
            image: KidsExcercise
        },
        {
            id: 5,
            title: "Children's Events",
            description: "We organize birthday parties and other special events for children. Our team takes care of everything.",
            image: events
        },
    ];

    return (
        <div className="tw-bg-[#FFC909]">
            <h1 className="tw-pt-20 tw-text-center tw-text-3xl tw-font-black">Our services</h1>
            <div className="card-services ">
                {allServices.map((service) => (
                    <div key={service.id} className="service-item">
                        <div className="image-services">
                            <img src={service.image} alt={service.title} />
                        </div>
                        <div className="content-services">
                            <span className="title-services">
                                {service.title}
                            </span>
                            <p className="desc-services">
                                {service.description}
                            </p>
                            <Link className="navlink" to="">Find out more →</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Services;
