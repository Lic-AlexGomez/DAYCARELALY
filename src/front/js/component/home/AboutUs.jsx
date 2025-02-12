import React, { useEffect, useRef } from "react"
import "../../../styles/AboutUsSection.css"
import img1 from "../../../img/1.png"
import img2 from "../../../img/2.png"
import img3 from "../../../img/3.png"
import img4 from "../../../img/4.png"
import img5 from "../../../img/5.png"
import img6 from "../../../img/6.png"
import img7 from "../../../img/7.png"
import { Link } from "react-router-dom"

const AboutUs = () => {
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tw-animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="tw-min-h-screen tw-bg-[#710A85] tw-overflow-hidden tw-relative">
      <div
        className="tw-relative tw-bottom-0 tw-left-0 tw-right-0 tw-w-full sm:tw-h-24 tw-h-7 tw-bg-no-repeat tw-bg-cover tw-bg-bottom "
        style={{
          backgroundImage: `url(${img6})`,
        }}
      />

      <div className="tw-absolute tw-left-0 tw-bottom-0 tw-w-32 tw-h-32 tw-rounded-full tw-bg-white/10 tw--translate-x-1/2 tw-translate-y-1/2" />
      <div className="tw-absolute tw-right-0 tw-top-0 tw-w-32 tw-h-32 tw-rounded-full tw-bg-white/10 tw-translate-x-1/2 tw--translate-y-1/2" />
      <div className="tw-absolute tw-left-[5%] tw-top-[10%]">
        <img
          src={img4}
          alt=""
          className="tw-w-16 tw-h-16 tw-opacity-30 tw-animate-float"
        />
      </div>
      <div className="tw-absolute tw-right-[15%] tw-bottom-[15%]">
        <img
          src={img5}
          alt=""
          className="tw-w-12 tw-h-12 tw-opacity-30 tw-animate-float-delayed"
        />
      </div>
      <div className="tw-container tw-mx-auto tw-px-6 tw-py-16">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-12 tw-items-center">
          {/* Left content */}
          <div className="tw-space-y-8">
            <div className="tw-space-y-4">
              <span className="tw-text-white/80 tw-text-sm tw-tracking-wider tw-block tw-text-start tw-font-bold tw-ml-5">More About Us</span>
              <h2 className="tw-text-white tw-text-4xl lg:tw-text-5xl tw-font-bold tw-leading-tight">
                Special Care For Your Children
              </h2>
              <p className="tw-text-white/70 tw-text-lg">
                Formulate innovative web-readiness and installed base ideas. Distinctively integrate high-payoff
                paradigms without next-generation systems disseminate holistic e-services through customer directed
                partnerships.
              </p>
            </div>
            <Link to="/about_us" className="tw-text-white tw-font-medium tw-text-lg tw-flex tw-items-center tw-space-x-2">
              <button
                className="tw-bg-white tw-text-[#710A85] tw-px-8 tw-py-3 tw-rounded-full tw-font-medium 
              hover:tw-bg-purple-50 tw-transform tw-transition-all hover:tw-scale-105 hover:tw-shadow-lg"
              >
                Learn more
              </button>
            </Link>
          </div>
          <div className="tw-relative tw-h-[600px]">
            <div
              className="tw-absolute tw-left-[40%] tw-top-0 tw-w-[45%] tw-aspect-square 
              tw-overflow-hidden tw-shadow-xl tw-z-10 tw-transform tw-transition-all tw-duration-500 hover:tw-scale-105"
            >
              <img
                src={img3}
                alt="Children learning"
                className="tw-w-full tw-h-full "
              />
            </div>
            <div
              className="tw-absolute tw-left-[20%] tw-top-[25%] tw-w-[45%] tw-aspect-square 
              tw-overflow-hidden tw-shadow-xl tw-z-20 tw-transform tw-transition-all tw-duration-500 hover:tw-scale-105"
            >
              <img
                src={img2}
                alt="Children playing"
                className="tw-w-full tw-h-full "
              />
            </div>
            <div
              className="tw-absolute tw-left-0 tw-top-[50%] tw-w-[45%] tw-aspect-square 
              tw-overflow-hidden tw-shadow-xl tw-z-30 tw-transform tw-transition-all tw-duration-500 hover:tw-scale-105"
            >
              <img
                src={img1}
                alt="Teacher with students"
                className="tw-w-full tw-h-full "
              />
            </div>
          </div>
        </div>
      </div>
      <div ref={statsRef} className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8 tw-mt-12 tw-mb-12">
        <div className="tw-text-center tw-space-y-2">
          <p className="tw-text-white tw-text-4xl tw-font-bold tw-transition-all tw-duration-700">45</p>
          <p className="tw-text-white/70 tw-text-sm tw-font-bold ">Qualified Teachers</p>
        </div>
        <div className="tw-text-center tw-space-y-2">
          <p className="tw-text-white tw-text-4xl tw-font-bold tw-transition-all tw-duration-700">20</p>
          <p className="tw-text-white/70 tw-text-sm tw-font-bold ">Years Of Experience</p>
        </div>
        <div className="tw-text-center tw-space-y-2">
          <p className="tw-text-white tw-text-4xl tw-font-bold tw-transition-all tw-duration-700">565</p>
          <p className="tw-text-white/70 tw-text-sm tw-font-bold ">Students Enrolled</p>
        </div>
        <div className="tw-text-center tw-space-y-2">
          <p className="tw-text-white tw-text-4xl tw-font-bold tw-transition-all tw-duration-700">15</p>
          <p className="tw-text-white/70 tw-text-sm tw-font-bold ">Total Groups</p>
        </div>
      </div>
      <div
        className="tw-relative tw-rotate-180 tw-bottom-0 tw-left-0 tw-right-0 tw-w-full sm:tw-h-24 tw-h-7 tw-bg-no-repeat tw-bg-cover tw-bg-bottom "
        style={{
          backgroundImage: `url(${img7})`,
        }}
      />
    </div>
  )
}
export default AboutUs

