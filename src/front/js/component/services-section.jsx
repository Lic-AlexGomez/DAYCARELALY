import React from "react"
import "../../styles/ServicesSection.css"


export default function ServicesSection() {
  const services = [
    {
      title: "Bus Service",
      description: "ubiquitous models rather than parallel initiatives. Seamlessly reinvent success.",
      icon: "🚌",
      bgColor: "tw-from-pink-100 tw-to-pink-50",
      iconBg: "tw-bg-pink-200",
      hoverBg: "hover:tw-shadow-pink-200",
    },
    {
      title: "Sports Training",
      description: "ubiquitous models rather than parallel initiatives. Seamlessly reinvent success.",
      icon: "🧢",
      bgColor: "tw-from-purple-700 tw-to-purple-600",
      iconBg: "tw-bg-purple-500",
      hoverBg: "hover:tw-shadow-purple-400",
      textColor: "tw-text-white",
    },
    {
      title: "Music Training",
      description: "ubiquitous models rather than parallel initiatives. Seamlessly reinvent success.",
      icon: "🎵",
      bgColor: "tw-from-pink-100 tw-to-pink-50",
      iconBg: "tw-bg-pink-200",
      hoverBg: "hover:tw-shadow-pink-200",
    },
    {
      title: "Best Teachers",
      description: "ubiquitous models rather than parallel initiatives. Seamlessly reinvent success.",
      icon: "👩‍🏫",
      bgColor: "tw-from-purple-700 tw-to-purple-600",
      iconBg: "tw-bg-purple-500",
      hoverBg: "hover:tw-shadow-purple-400",
      textColor: "tw-text-white",
    },
  ];

  return (
    <section className="tw-py-20 tw-px-4 tw-bg-gradient-to-b tw-from-white tw-to-pink-30">
      <div className="tw-max-w-7xl tw-mx-auto">
        <h1 className="service-section tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-purple-700 tw-text-center tw-mb-6">
          Providing Good Qualities For
        </h1>
        <h2 className="service-section tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-purple-600 tw-text-center tw-mb-16">
          Your Loving Kids
        </h2>
        
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`
                tw-rounded-2xl 
                tw-p-8 
                tw-bg-gradient-to-br 
                ${service.bgColor}
                tw-transform 
                hover:tw-scale-105 
                tw-transition-all 
                tw-duration-300 
                tw-ease-in-out
                hover:tw-shadow-xl
                ${service.hoverBg}
                ${service.textColor || 'tw-text-gray-800'}
              `}
            >
              <div className={`
                tw-w-16 
                tw-h-16 
                ${service.iconBg}
                tw-rounded-full 
                tw-flex 
                tw-items-center 
                tw-justify-center 
                tw-text-3xl 
                tw-mb-6
                tw-mx-auto
                tw-shadow-lg
              `}>
                {service.icon}
              </div>
              
              <h3 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-center">
                {service.title}
              </h3>
              
              <p className={`
                tw-text-sm 
                tw-leading-relaxed 
                tw-text-center
                ${service.textColor ? 'tw-opacity-90' : 'tw-text-gray-600'}
              `}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
