import React from "react"
import { ArrowRight } from "lucide-react"
import img8 from "../../img/8.png"
import img9 from "../../img/9.png"
import img10 from "../../img/10.png"
import img11 from "../../img/11.png"

const EducationalPrograms = () => {
  const programs = [
    {
      id: 1,
      title: "Online Class",
      description: "Eu turis egestas pretium semper placerat magna ac.",
      image: img8,
    },
    {
      id: 2,
      title: "Formal Tuition",
      description: "Eu turis egestas pretium semper placerat magna ac.",
      image: img8,
    },
    {
      id: 3,
      title: "Online Class",
      description: "Eu turis egestas pretium semper placerat magna ac.",
      image: img9,
    },
    {
      id: 4,
      title: "Formal Tuition",
      description: "Eu turis egestas pretium semper placerat magna ac.",
      image: img9,
    },
  ]

  return (
    <div className="tw-border-none tw-z-10 tw-min-h-screen tw-bg-gradient-to-b tw-from-purple-100 tw-to-purple-200 tw-py-16 tw-px-4 tw-relative tw-overflow-hidden">
      {/* Decorative Elements */}
      <div className="tw-absolute tw-left-8 tw-top-8 tw-animate-float">       
          <img src={img11} alt="Decorative Element" /> 
      </div>
            <div className="tw-absolute tw-right-8 tw-top-8 tw-animate-float-delayed">
        <img src={img10} alt="Decorative Element" />
      </div>

      {/* Content */}
      <div className="tw-max-w-6xl tw-mx-auto">
        <div className="tw-text-center tw-mb-12">
          <p className="tw-text-purple-600 tw-mb-2">Educational Programs</p>
          <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-gray-800">
            Step By Step Systematic Education
          </h2>
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="tw-bg-white tw-rounded-3xl tw-p-6 tw-shadow-lg hover:tw-shadow-xl 
                tw-transition-all tw-duration-300 tw-transform hover:tw-scale-105"
            >
              <div className="tw-flex tw-items-center tw-gap-7">
                <div className="tw-w-44 tw-h-34 tw-rounded-2xl tw-overflow-hidden tw-flex-shrink-0">
                  <img
                    src={program.image || "/placeholder.svg"}
                    alt={program.title}
                    className="tw-w-full tw-h-full tw-object-cover"
                  />
                </div>
                <div className="tw-flex-1">
                  <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800 tw-mb-2">{program.title}</h3>
                  <p className="tw-text-gray-600 tw-mb-4">{program.description}</p>
                  <a
                    href="#"
                    className="tw-inline-flex tw-items-center tw-text-purple-600 
                      hover:tw-text-purple-700 tw-font-medium tw-transition-colors"
                  >
                    Read more
                    <ArrowRight className="tw-w-4 tw-h-4 tw-ml-2" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Bottom Wave */}
      {/* <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0">
      <svg
          className="tw-w-full tw-h-32"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="white" />
        </svg>
      </div> */}
      <div className="tw-absolute tw-mt-20 tw-bottom-0 tw-left-0 tw-right-0 edu">

      </div>
    </div>
  )
}

export default EducationalPrograms

