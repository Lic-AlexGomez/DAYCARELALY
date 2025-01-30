import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import img12 from "../../img/12.png";
import img13 from "../../img/13.png";
import img14 from "../../img/14.png";
import img15 from "../../img/15.png";

const Statistics = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    {
      value: 3561,
      label: "Students admission",
      suffix: "+",
      img: img12,
    },
    {
      value: 156,
      label: "Total No. of Class",
      suffix: "+",
      img: img13,
    },
    {
      value: 15,
      label: "No. of Teachers",
      suffix: "+",
      img: img14,
    },
    {
      value: 8,
      label: "Years Experience",
      suffix: "+",
      img: img15,
    },
  ];

  // Background letters and numbers for decoration
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const decorations = Array.from({ length: 50 }, () => ({
    char: characters[Math.floor(Math.random() * characters.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    opacity: 0.03 + Math.random() * 0.04,
    size: 12 + Math.random() * 24,
  }));

  return (
    <div className="tw-relative tw-overflow-hidden tw-mt-[-4rem] tw-border-none tw-pb-5 tw-bg-black">
      {/* Main content section with background image and oval curve at the bottom */}
     
      <div
        className="tw-relative tw-bg-cover tw-bg-center tw-bg-no-repeat "
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-5WSo4W6yJfhGPdcu0EKkjXOacK5cdG.png')`,
          paddingTop: "8rem", // Added extra padding to account for overlap
         
        }}
      >
         <div className="tw-absolute  tw-top-0 tw-left-0 tw-right-0 ">
          <svg
            className="tw-w-full tw-h-42 tw-transform tw-rotate-180"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="#EAD7FF" />
          </svg>
        </div>
        {/* Background Decorations */}
        <div className="tw-absolute tw-inset-0 tw-overflow-hidden">
          {decorations.map((dec, i) => (
            <span
              key={i}
              className="tw-absolute tw-text-white tw-font-bold"
              style={{
                left: `${dec.x}%`,
                top: `${dec.y}%`,
                transform: `rotate(${dec.rotation}deg)`,
                opacity: dec.opacity,
                fontSize: `${dec.size}px`,
              }}
            >
              {dec.char}
            </span>
          ))}
        </div>

        {/* Stats Content */}
        <div className="tw-relative tw-z-10 tw-pt-20 tw-pb-52">
          <div ref={ref} className="tw-max-w-6xl tw-mx-auto tw-px-4 tw-grid tw-grid-cols-2 tw-gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`tw-text-center tw-transform tw-transition-all tw-duration-700 ${
                  inView ? "tw-translate-y-0 tw-opacity-100" : "tw-translate-y-10 tw-opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="tw-w-40 tw-h-40  tw-mx-auto tw-mb-6 tw-shadow-lg">
                  <img src={stat.img} alt="" />
                </div>
                <div className="tw-text-white tw-text-4xl tw-font-bold tw-mb-2">
                  {inView ? <CountUp end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
                </div>
                <div className="tw-text-white/90 tw-text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Oval curve at the bottom */}
     
      </div>
      <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0">
      <svg
          className="tw-w-full tw-h-42"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0C480 80 960 80 1440 0V120H0V0Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};

// Counter animation component
const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      if (countRef.current < end) {
        const nextCount = Math.min(countRef.current + increment, end);
        setCount(nextCount);
        countRef.current = nextCount;
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <>
      {Math.round(count)}
      {suffix}
    </>
  );
};

export default Statistics;