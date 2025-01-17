import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { BookOpen } from 'lucide-react';
import book from "../../img/books.png";
import kids1C from "../../img/kids1C.png";
import kids2C from "../../img/kids2C.png";
import kids3C from "../../img/kids3C.png";
import kids4C from "../../img/kids4C.png";


export const Classes = () => {
  const { store, actions } = useContext(Context);
  const [visibleClasses, setVisibleClasses] = useState(8);

  useEffect(() => {
    if (store.classes.length === 0) {
      actions.fetchClasses();
    }
  }, [store.classes.length]);

  const handleShowMore = () => {
    setVisibleClasses((prev) => prev + 4);
  };

  const allClasses = [
    {
      id: 1,
      title: "Language Class",
      price: "45",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-5 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image: kids1C,
    },
    {
      id: 2,
      title: "Drawing Class",
      price: "47",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-4 Years",
      time: "9-11 am",
      capacity: "35 Kids",
      image: kids2C,
    },
    {
      id: 3,
      title: "Mathematics Class",
      price: "50",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-5 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image: kids3C,
    },
    {
      id: 4,
      title: "Language Class",
      price: "45",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "2-4 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image: kids4C,
    },
    // Duplicate the first 4 items to match the 8-item grid
    {
      id: 5,
      title: "Language Class",
      price: "45",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-5 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image:kids1C,
    },
    {
      id: 6,
      title: "Drawing Class",
      price: "47",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-4 Years",
      time: "9-11 am",
      capacity: "35 Kids",
      image: kids2C,
    },
    {
      id: 7,
      title: "Mathematics Class",
      price: "50",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "3-5 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image: kids3C,
    },
    {
      id: 8,
      title: "Language Class",
      price: "45",
      description: "Interactive brand client center through is customized value good ideas.",
      age: "2-4 Years",
      time: "8-10 am",
      capacity: "30 Kids",
      image: kids4C,
    },
  ];

  return (
    <div className="tw-bg-white tw-py-12">
     
      <div className="tw-container tw-mx-auto tw-px-4 tw-text-center tw-mb-12">
        <img 
          src={book}
          alt="Sandwich icon" 
          className="tw-mx-auto tw-mb-2"
        />
         {/* <div className="tw-inline-block tw-p-4 tw-rounded-full tw-bg-[#FFC909] tw-bg-opacity-20 tw-mb-4">
            <BookOpen className="tw-w-8 tw-h-8 tw-text-[#9C29B2]" />
          </div> */}
        <div className="tw-text-[#9C29B2] tw-text-sm tw-mb-2 font-bold">On Going Classes</div>
        <h2 className="tw-text-3xl tw-font-bold title-component-class tw-text-[#9C29B2]">
          Take The Classes & Start
          <br />
          Learning From Today
        </h2>
      </div>

    
      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
          {/* {store.classes.slice(0, visibleClasses).map((classItem) => ( */}
          {allClasses.slice(0, visibleClasses).map((classItem) => (
            <div
              key={classItem.id}
              className="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-border-4 tw-border-[#FFC909]"
            >
              <div className="tw-aspect-w-16 tw-aspect-h-9">
                <img
                  src={classItem.image || kids1C}
                  alt={classItem.title}
                  className="tw-w-full tw-h-full tw-object-cover"
                />
              </div>
              <div className="tw-p-4 tw-bg-[#9C29B2] tw-text-white">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <h3 className="tw-text-lg tw-font-bold">
                    {classItem.title}
                  </h3>
                  <div className="tw-bg-[#FFC909] tw-text-[#9C29B2] tw-px-2 tw-py-2 tw-rounded-full tw-font-bold">
                    ${classItem.price}
                  </div>
                </div>
                <p className="tw-text-sm tw-mb-4 tw-opacity-90 tw-text-left">
                  {classItem.description}
                </p>
                <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-mb-4 tw-text-sm">
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909]">
                    <div className="tw-text-[#FFC909] tw-font-bold">Age:</div>
                    <div>{classItem.age}</div>
                  </div>
                  <div className="tw-text-center tw-border-r tw-border-[#FFC909]">
                    <div className="tw-text-[#FFC909] tw-font-bold">Time:</div>
                    <div>{classItem.time}</div>
                  </div>
                  <div className="tw-text-center">
                    <div className="tw-text-[#FFC909] tw-font-bold">Capacity:</div>
                    <div>{classItem.capacity}</div>
                  </div>
                </div>
                <button className="tw-w-full hover:tw-bg-[#9C29B2] hover:tw-text-white tw-py-2 tw-border tw-border-white tw-rounded-full tw-text-sm tw-bg-[#FFC909] tw-text-[#9C29B2] tw-transition-colors">
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>

        {visibleClasses < allClasses.length && (
          <div className="tw-text-center tw-mt-8">
            <button
              onClick={handleShowMore}
              className="tw-bg-[#9C29B2] tw-text-white tw-px-8 tw-py-3 tw-rounded-full hover:tw-bg-[#FFC909] hover:tw-text-[#9C29B2] tw-transition-colors"
            >
              More Classes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;

