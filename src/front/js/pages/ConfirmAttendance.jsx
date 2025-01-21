import React from "react";
import '../../styles/ConfirmAttendance.css'

const ConfirmAttendance = () => {
    return (
        <div className="tw-bg-[#FFC909]  tw-flex tw-flex-col tw-justify-center tw-items-center">
            <h1 className="title-confirmAttendance tw-text-2xl tw-font-bold tw-pt-20 tw-pb-10 ">
                Confirm Attendance
            </h1>

            <div className="formConfirmAttendance tw-flex tw-justify-center tw-items-center  tw-mb-20">
                <form className=" tw-w-full tw-max-w-md ">
                    <label className="tw-block tw-mb-12">
                        <span className="FullName tw-mb-2  ">Child's Full Name:</span>
                        <input type="text" placeholder="Full Name" className="tw-text-white input-fullName tw-w-full tw-p-4 tw-border tw-rounded " />
                    </label>
                    <label className="tw-block tw-mb-12">
                        <span className="FullName tw-mb-2 ">Event Selection:</span>
                        <select className="input-fullName tw-w-full tw-p-4 tw-border tw-rounded tw-text-white">
                            <option className="tw" value="Select Event">Select Event</option>
                            <option value="Skill Games">Skill Games</option>
                            <option value="Puppet Theater">Puppet Theater</option>
                            <option value="Halloween Party">Halloween Party</option>
                        </select>
                    </label>
                    <label className="tw-block tw-mb-12">
                        <span className="FullName tw-mb-2 ">Parent Name:</span>
                        <input type="text" placeholder="Parent Name" className="tw-text-white input-fullName tw-w-full tw-p-4 tw-border  tw-rounded" />
                    </label>
                    <label className="tw-block tw-mb-12">
                        <span className="FullName tw-mb-2 ">Special Request:</span>
                        <textarea type="text" placeholder="Any dietary restrictions or special needs?" className=" tw-h-32  tw-text-white input-fullName tw-w-full tw-p-4 tw-border  tw-rounded" />
                    </label>
                    <div className="tw-w-full tw-flex tw-justify-center">
                        <button type="submit" className=" buttonConfirmAttendance   tw-px-6  ">
                        Confirm Attendance
                    </button>
                    </div>
                    
                </form>
            </div>
        </div>

    )
}
export default ConfirmAttendance;