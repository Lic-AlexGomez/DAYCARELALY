
import React,{ useState } from "react"
import daycarebuilding from "../../img/daycarebuilding.jpg"
import worker from "../../img/Daycare-worker.jpg"
import kids from "../../img/kids-playing.jpg"
import playground from "../../img/playground.jpg"
import { Link } from "react-router-dom"
import Getintouch from "../component/home/Getintouch"

const AboutUs = () => {
  const [selectedAge, setSelectedAge] = useState("Infant")

  const ageGroups = {
    Infant: {
      label: "Infant",
      subtitle: "6 weeks to 17 months",
      image: "https://teis-ei.com/wp-content/uploads/2023/04/one-year-old-waving-768x480.jpg",
    },
    Toddler: {
      label: "Toddler",
      subtitle: "18 to 23 months",
      image: "https://www.cdc.gov/child-development/media/images/girl-holding-apple-and-smiling.png",
    },
    Preschool: {
      label: "Preschool",
      subtitle: "2 to 4 years",
      image: "https://cdn.shopify.com/s/files/1/0316/7518/7336/files/2-year-old-milestones_3.jpg?v=1702618360",
    },
    SchoolAge: {
      label: "School-Age",
      subtitle: "5 to 12 years",
      image: "https://www.ffyf.org/wp-content/uploads/2023/10/iStock-1337580130-scaled.jpg",
    },
  }

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
            <h1 className="tw-text-4xl tw-font-extrabold tw-text-[var(--primary)] sm:tw-text-5xl tw-mt-2">Laly Daycare</h1>
            <p className="tw-text-lg tw-text-gray-700 tw-mb-6 tw-mt-4">
            Every day, your child's imagination grows and their curiosity gathers momentum. Laly's Family Group Daycare, empowers and prepares them for life. 

            <br/><br/>The selection of an early childhood educational program for your children is an important one. We hope the following information provides answers to some of your questions and helps narrow down your child care options.
            </p>
            <Link to="/contactus">
              <div className="tw-flex tw-gap-4">
                <button className="tw-bg-secondary tw-text-primary tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-text-[#fff]">
                  REQUEST INFORMATION
                </button>
              </div>
            </Link>
          </div>
          <div className="md:tw-w-1/2 tw-mt-6 md:tw-mt-0">
            <img
              src={daycarebuilding || "/placeholder.svg"}
              alt="Laly Daycare"
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
            What Makes Laly Daycare Special
          </h1>
          <p className="tw-mt-4">
          Laly Daycare is directed by Laury Jimenez and Adam Cruz, who oversee all aspects of the center’s operation. Together with our outstanding staff, Laly Daycare provides a warm, caring environment for you and your child. Our Life Essentials® curriculum is uniquely designed to develop the essential skills children need to thrive. At Daycare Rainbow, your child will grow socially, physically, emotionally, and intellectually. Our highly trained educators are dedicated to guiding, nurturing, and cultivating your child’s development every step of the way.
          </p>
        </div>
        {/* Sections */}
        <div className="tw-mt-12 tw-grid tw-gap-12 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-max-w-6xl tw-mx-auto">
          <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
            <img src={worker || "/placeholder.svg"} alt="Caregivers" className="tw-w-full tw-h-48 tw-object-cover" />
            <div className="tw-p-6">
              <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Experienced Team</h3>
              <p className="tw-mt-2 tw-text-gray-600">
                Our staff is what makes Laly Daycare a unique place. All the staff have been certified and participate
                in many in-service training programs and workshops throughout the year.
              </p>
            </div>
          </div>
          <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
            <img src={kids || "/placeholder.svg"} alt="Learning" className="tw-w-full tw-h-48 tw-object-cover" />
            <div className="tw-p-6">
              <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Engaging Programs</h3>
              <p className="tw-mt-2 tw-text-gray-600">
                We offer programs for children ranging from 6 weeks to 12 years old, providing developmentally
                appropriate learning opportunities.
              </p>
            </div>
          </div>
          <div className="tw-bg-white tw-shadow-lg tw-rounded-2xl tw-overflow-hidden">
            <img
              src={playground || "/placeholder.svg"}
              alt="Facilities"
              className="tw-w-full tw-h-48 tw-object-cover"
            />
            <div className="tw-p-6">
              <h3 className="tw-text-2xl tw-font-semibold tw-text-gray-800">Safe Environment</h3>
              <p className="tw-mt-2 tw-text-gray-600">
                We maintain strict safety policies and provide positive guidance for children in a warm, caring
                environment.
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
                className={`tw-p-4 tw-rounded-lg tw-border tw-cursor-pointer ${
                  selectedAge === key ? "tw-bg-[#ffc909] tw-text-white" : "tw-bg-white tw-text-gray-800"
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
              src={ageGroups[selectedAge].image || "/placeholder.svg"}
              alt={ageGroups[selectedAge].label}
              className="tw-rounded-xl tw-shadow-lg tw-w-full tw-max-w-md"
            />
          </div>
        </div>

        <div className="tw-mt-16 tw-max-w-4xl tw-mx-auto tw-text-center">
          <h3 className="tw-text-3xl tw-font-bold tw-text-[#9C29B2]">Join Our Laly Daycare Family</h3>
          <p className="tw-mt-4 tw-text-lg tw-text-gray-600">
            If you wish to visit the daycare or receive additional information, simply call us. Thank you for your
            interest and consideration in our early childhood programs. We look forward to sharing our daycare with you.
          </p>
          <Link to="/contactus">
            <button className="tw-mt-4 tw-bg-primary tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-lg tw-bg-[#ffc909]">
              Contact Us Today
            </button>
          </Link>
        </div>
      </div>
      <Getintouch />
    </div>
  )
}

export default AboutUs

