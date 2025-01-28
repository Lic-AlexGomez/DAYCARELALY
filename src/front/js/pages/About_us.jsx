import React, { useState } from "react";
import daycarebuilding from "../../img/daycarebuilding.jpg"
import worker from "../../img/Daycare-worker.jpg"
import kids from "../../img/kids-playing.jpg"
import playground from "../../img/playground.jpg"
import { Link } from "react-router-dom";
import Getintouch from "./Getintouch";

const AboutUs = () => {
    const [selectedAge, setSelectedAge] = useState("Infant");

    const ageGroups = {
        Infant: {
            label: "Infant",
            subtitle: "6 weeks to 12 months",
            image:
                "https://teis-ei.com/wp-content/uploads/2023/04/one-year-old-waving-768x480.jpg",
        },
        Toddler: {
            label: "Toddler",
            subtitle: "12 to 24 months",
            image:
                "https://www.cdc.gov/child-development/media/images/girl-holding-apple-and-smiling.png",
        },
        EarlyPreschool: {
            label: "Early Preschool",
            subtitle: "2-Year-Olds",
            image:
                "https://cdn.shopify.com/s/files/1/0316/7518/7336/files/2-year-old-milestones_3.jpg?v=1702618360",
        },
        Preschool: {
            label: "Preschool",
            subtitle: "3-Year-Olds",
            image:
                "https://i0.wp.com/justjass.com/wp-content/uploads/2022/11/Preschool-Must-Haves-For-3-Year-Olds-Blog.jpg?fit=2240%2C1260&ssl=1",
        },
        PreKindergarten: {
            label: "Pre-Kindergarten",
            subtitle: "4-5 Years-Old",
            image:
                "https://www.ffyf.org/wp-content/uploads/2023/10/iStock-1337580130-scaled.jpg",
        },
    };
    return (
        <div className="tw-bg-beige tw-min-h-screen tw-p-8 tw-w-full">
            <div className="tw-max-w-full tw-w-full tw-px-8">
                <nav className="tw-text-sm tw-mb-4">
                    <a href="/" className="tw-text-primary hover:tw-underline">
                        <br />
                        <br />
                        <br />
                        <br />
                    </a>
                </nav>
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-center md:tw-items-start">
                    <div className="md:tw-w-1/2 md:tw-pr-8">
                        <h1 className="tw-text-4xl tw-font-extrabold tw-text-[var(--primary)] sm:tw-text-5xl">
                            Daycare Rainbow
                        </h1>
                        <p className="tw-text-lg tw-text-gray-700 tw-mb-6">
                            Every day, your child's imagination grows and their curiosity
                            gathers momentum. Kiddie Academy of North Albuquerque empowers and
                            prepares them for life.
                        </p>
                        <Link to="/contactus">
                        <div className="tw-flex tw-gap-4">
                            <button className="tw-bg-secondary tw-text-primary tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-bg-[#ffc909]">
                                REQUEST INFORMATION
                            </button>
                        </div>
                        </Link>
                    </div>
                    <div className="md:tw-w-1/2 tw-mt-6 md:tw-mt-0">
                        <img
                            src={daycarebuilding}
                            alt="Kiddie Academy"
                            className="tw-rounded-lg tw-shadow-lg"
                        />
                        <a
                            href="/gallery"
                            className="tw-block tw-text-primary tw-text-sm tw-text-center tw-mt-4 hover:tw-underline"
                        >
                            View Our Gallery
                        </a>
                    </div>
                </div>
                <div className="tw-text-lg tw-text-gray-700 tw-mb-6">
                    <h1 className="tw-text-4xl tw-font-extrabold tw-text-[var(--primary)] sm:tw-text-5xl">
                        <br />
                        What Makes Our Rainbow Academy Special
                    </h1>
                    <p>
                        Our Life Essentials® curriculum is uniquely focused on the development of the outcomes that prepare children for life. At Daycare Rainbow, your child will grow socially, physically, emotionally, and intellectually. Our highly trained educators are there every step of the way to guide, nurture, and cultivate your child’s development.
                    </p>
                </div>
                {/* Sections */}
                <div className="tw-mt-12 tw-grid tw-gap-12 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-max-w-6xl tw-mx-auto">
                    <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
                        <img
                            src={worker}
                            alt="Caregivers"
                            className="tw-w-full tw-h-48 tw-object-cover"
                        />
                        <div className="tw-p-6">
                            <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Experienced Team</h3>
                            <p className="tw-mt-2 tw-text-gray-600">
                                Our certified caregivers and educators are passionate about providing a nurturing and safe environment.
                            </p>
                        </div>
                    </div>
                    <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
                        <img
                            src={kids}
                            alt="Learning"
                            className="tw-w-full tw-h-48 tw-object-cover"
                        />
                        <div className="tw-p-6">
                            <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Engaging Curriculum</h3>
                            <p className="tw-mt-2 tw-text-gray-600">
                                Play-based learning combined with structured activities to spark creativity and curiosity.
                            </p>
                        </div>
                    </div>
                    <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
                        <img
                            src={playground}
                            className="tw-w-full tw-h-48 tw-object-cover"
                        />
                        <div className="tw-p-6">
                            <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Safe Facilities</h3>
                            <p className="tw-mt-2 tw-text-gray-600">
                                Modern, child-friendly spaces designed with safety and fun in mind.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="tw-max-w-7xl tw-mx-auto tw-text-center">
                    <h2 className="tw-text-4xl tw-font-extrabold tw-text-[var(--primary)] sm:tw-text-5xl">
                        <br />
                        Learning for Every Age
                    </h2>
                </div>

                <div className="tw-mt-8 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8 tw-items-center">
                    {/* Age Group List */}
                    <div className="tw-space-y-4">
                        {Object.keys(ageGroups).map((key) => (
                            <div
                                key={key}
                                className={`tw-p-4 tw-rounded-lg tw-border tw-cursor-pointer ${selectedAge === key
                                    ? "tw-bg-[#ffc909] tw-text-white"
                                    : "tw-bg-white tw-text-gray-800"
                                    }`}
                                onClick={() => setSelectedAge(key)}
                            >
                                <h3 className="tw-text-xl tw-font-bold">{ageGroups[key].label}</h3>
                                <p className="tw-text-sm">{ageGroups[key].subtitle}</p>
                            </div>
                        ))}
                    </div>
                    <div className="tw-flex tw-justify-center tw-items-center">
                        <img
                            src={ageGroups[selectedAge].image}
                            alt={ageGroups[selectedAge].label}
                            className="tw-rounded-xl tw-shadow-lg tw-w-full tw-max-w-md"
                        />
                    </div>
                </div>

                <div className="tw-mt-16 tw-max-w-4xl tw-mx-auto tw-text-center">
                    <h3 className="tw-text-3xl tw-font-bold tw-text-[#9C29B2]">
                        Join Our Daycare Family
                    </h3>
                    <p className="tw-mt-4 tw-text-lg tw-text-gray-600">
                        At our Daycare, your child's growth and happiness are our priorities.
                        Let’s build a bright future together!
                    </p>
                    <Link to="/contactus">
                    <button className="tw-bg-primary tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-lg tw-bg-[#ffc909]">
                        Contact Us Today
                    </button>
                    </Link>
                </div>
            </div>
            <Getintouch />
        </div>
    );
};

export default AboutUs;