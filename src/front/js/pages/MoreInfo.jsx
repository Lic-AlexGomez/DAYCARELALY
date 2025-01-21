import React from "react"
import '../../styles/moreInfoEvents.css'
import imgEvents4 from "../../img/imgEvents4.png";




const MoreInfo = () => {
  return (
    <div className="tw-bg-[#FFC909]">
      <div className="moreinfo-events-container tw-flex tw-justify-center tw-items-center tw-pt-20 ">
        <div className="image-moreinfo-events-container">
          <img src={imgEvents4} alt="" />
        </div>
        <div className="info-events">
          <div className="title-info-events tw-flex tw-justify-center tw-items-center tw-mt-2">
            Skill Games
          </div>
          <div className="subtitle-info-events tw-flex tw-justify-center tw-items-center tw-mt-4 tw-mb-4">
            ATTENTION PARENTS AND CHILDRENS 🎮🎉
          </div>
          <div className="description1-info-events tw-flex tw-justify-center tw-items-center">
            The Skill Game is coming to the City's Main Theater and this is your chance to be part of an epic competition! 🏆 Only 50 children will be able to register, so don't be left out! 🔥
          </div>
          <div className="eventDetails-info-events tw-flex tw-justify-center tw-items-center tw-mt-4 tw-mb-2">
            Event Details:
          </div>
          <div className="eventDetails-info-events tw-flex tw-justify-center tw-items-center">
            🗓 Date:  January 13, 2025
          </div>
          <div className="startTime-info-events tw-flex tw-justify-center tw-items-center">
            ⏰ Start time: 9:00 AM
          </div>
          <div className="location-info-events tw-flex tw-justify-center tw-items-center">
            📍 Location: Main City Theater
          </div>
          <div className="description2-info-events tw-flex tw-justify-center tw-items-center tw-mt-6">
            🎮 What is the Skill Game?: A fun competition that will test your reflexes, mental speed and skills to solve challenges in real time.👦👧 Limited registration: Only 50 children will be able to participate!🎁 Prizes for the fastest and most skilled. Adrenaline is guaranteed! If your child is an expert in games of skill and wants to win an incredible prize, be sure to register him as soon as possible! Places are very limited.
          </div>

          <div className="tw-flex tw-justify-center tw-items-center tw-mt-6">
            <button className="confirmAttendance-events  tw-text-white tw-px-12 tw-py-2 ">
              Confirm Attendance
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}
export default MoreInfo;