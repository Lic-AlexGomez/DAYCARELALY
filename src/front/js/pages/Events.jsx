import React from "react";
import imgEvents1 from "../../img/imgEvents1.png"
import imgEvents2 from "../../img/imgEvents2.png"
import imgEvents3 from "../../img/imgEvents3.png"
import '../../styles/Events.css'

const Events = () => {

    const allEvents = [
        {
          id: 1,
          date: "January 13 , 2025",
          title: "Skill Games",
          description: "This challenge is for the bravest and most agile, those who dare to face a series of tests that will test your coordination, mental speed and physical ability. Face fun, intense and dynamic challenges, designed to test both your body and your mind.",
          image:imgEvents1
        },
        {
            id: 2,
            date: "February 25 , 2025",
            title: "puppet theater",
            description: "Immerse yourself in a unique experience for the whole family, in which the most incredible stories are told by fantastic beings, controlled by invisible hands but full of magic. This event will take you to a universe full of charming characters.",
            image: imgEvents2
        },
        {
            id: 3,
            date: "October 30 , 2025",
            title: "Halloween Party",
            description: "oin our Theme Costume Party, a unique event where imagination has no limits. This year, we have chosen a special theme that will transform our party into a parallel universe",
            image: imgEvents3
        },
    ]
    return (
        <>
            <h1 className="tw-mt-10 tw-text-center tw-text-3xl tw-font-black">Upcoming Events</h1>
            {allEvents.map((eventItem) => (
                <div key={eventItem.id} className="cardEvents tw-mx-auto tw-relative">
                    <div className="image-container-events tw-absolute  tw-bottom-0 ">
                        <img className="tw-ml-1" src={eventItem.image} alt="" />
                    </div>,

                    <div className="infoContainer tw-absolute tw-right-14 tw-top-0 tw-py-2 tw-flex tw-flex-col tw-items-center tw-text-center tw-w-1/4">
                        <div className="date tw-text-xs tw-mb-4">
                            {eventItem.date}
                        </div>
                        <div className="title tw-text-l tw-font-bold tw-mb-4">
                            <h1>{eventItem.title}</h1>
                        </div>
                        <div className="descriptionEvent tw-text-xs tw-text-justify tw-mb-4">
                            {eventItem.description}
                        </div>
                        <div className="tw-flex tw-flex-col tw-items-center tw-space-y-2">
                            <button className="buttonMoreInfo tw-text-xs">More info</button>
                            <button className="buttonConfirmAttendance tw-text-xs">Confirm Attendance</button>
                        </div>
                    </div>
                </div>  
            ))}
        </>
    )
}

export default Events;