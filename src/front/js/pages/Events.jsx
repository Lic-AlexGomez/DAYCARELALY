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
        <div className="tw-bg-[#FFC909] tw-p-10">
  <h1 className="tw-mt-10 tw-pt-20 tw-text-center tw-text-3xl tw-font-black">Upcoming Events</h1>
  <div id="eventsCarousel" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
      {allEvents.map((eventItem, index) => {
        if (index % 3 === 0) {
          const groupedEvents = allEvents.slice(index, index + 3);
          return (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="row tw-g-1"> {/* Aquí ajustamos el gap entre las columnas */}
                {groupedEvents.map((event, eventIndex) => (
                  <div key={event.id} className="col-12  col-md-4">
                    <div className="cardEvents tw-mx-auto tw-relative">
                      <div className="image-container-events tw-absolute tw-bottom-0">
                        <img className="tw-ml-1" src={event.image} alt={event.title} />
                      </div>

                      <div className="infoContainer tw-absolute tw-right-14 tw-top-0 tw-py-2 tw-flex tw-flex-col tw-items-center tw-text-center tw-w-1/4">
                        <div className="date-events tw-text-xs tw-mb-4">
                          {event.date}
                        </div>
                        <div className="title-events tw-text-l tw-font-bold tw-mb-4">
                          <h1>{event.title}</h1>
                        </div>
                        <div className="descriptionEvent tw-text-xs tw-text-justify tw-mr-2 tw-mb-4 ">
                          {event.description}
                        </div>
                        <div className="tw-flex tw-flex-col tw-items-center tw-space-y-2">
                          <button className="buttonMoreInfo tw-text-xs">More info</button>
                          <button className="buttonConfirmAttendance tw-text-xs">Confirm Attendance</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>

    {/* Controles del Carrusel */}
    <button 
      className="button-prev tw-absolute tw-top-1/2 tw-left-0 tw-transform tw--translate-y-1/2 tw-p-4" 
      type="button" 
      data-bs-target="#eventsCarousel" 
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button 
      className="button-next tw-absolute tw-top-1/2 tw-right-0 tw-transform tw--translate-y-1/2 tw-p-4" 
      type="button" 
      data-bs-target="#eventsCarousel" 
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
</div>


    )
}

export default Events;