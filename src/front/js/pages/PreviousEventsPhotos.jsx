import React from "react";
import elfos from "../../img/elfos.jpeg";
import villancicos from "../../img/villancicos.jpg";
import disfraz from "../../img/disfraz.jpg";

import '../../styles/PreviousEventsPhotos.css'


const PreviousEventsPhotos = () => {
    
    const allPhotos = [
        {
            id: 1,
            title: "elf chariot",
            title2: "¡ AMAZING !",
            description: "The elves distributed incredible gifts to all the children present.",
            image: elfos
        },
        {
            id: 2,
            title: " Christmas carols",
            title2: "! DANCING WITH SANTA !",
            description: "Different groups of dancers or children performed choreographies with popular Christmas carols such as Merry Christmas or Silent Night.",
            image: villancicos
        },
        {
            id: 3,
            title: "costume contest",
            title2: "! CELEBRATE THE MAGIC OF CHRISTMAS WITH US !",
            description: "the perfect time to bring out your creativity and dress in the most original, fun or traditional outfit. Would you like to see Santa Claus, elves, reindeer, angels or even unique Christmas characters parading? This contest is for you!",
            image: disfraz
        },
        {
            id: 4,
            title: "elf chariot",
            title2: "¡ AMAZING !",
            description: "The elves distributed incredible gifts to all the children present.",
            image: elfos
        },
        {
            id: 5,
            title: " Christmas carols",
            title2: "! DANCING WITH SANTA !",
            description: "Different groups of dancers or children performed choreographies with popular Christmas carols such as Merry Christmas or Silent Night.",
            image: villancicos
        },
        {
            id: 6,
            title: "costume contest",
            title2: "! CELEBRATE THE MAGIC OF CHRISTMAS WITH US !",
            description: "the perfect time to bring out your creativity and dress in the most original, fun or traditional outfit. Would you like to see Santa Claus, elves, reindeer, angels or even unique Christmas characters parading? This contest is for you!",
            image: disfraz
        },
        
    ];

    return (
        <div className="tw-bg-[#FFC909]">
            <h1 className=" tw-pt-20 tw-text-center tw-text-3xl tw-font-black">Christmas Parade</h1>
            <div className="photos-container">
                {allPhotos.map((photo) => (
                    <div key={photo.id} className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <p className="title">{photo.title}</p>
                                <img className="photo-event" src={photo.image} alt={photo.title} />
                            </div>
                            <div className="flip-card-back">
                                <p className="title2">{photo.title2}</p>
                                <p>{photo.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviousEventsPhotos;


