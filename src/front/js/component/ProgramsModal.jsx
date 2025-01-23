import React from "react";

const ProgramModal = ({ program, isOpen, onClose }) => {
    if (!isOpen) return null; 

    return (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/50">
            <div className="tw-bg-white tw-rounded-3xl tw-overflow-hidden tw-shadow-lg tw-w-11/12 md:tw-w-2/3 lg:tw-w-1/2">
                <div className="tw-p-6 tw-bg-gradient-to-r tw-from-[#9C29B2] tw-to-[#FFC909] tw-text-white tw-font-bold tw-text-lg">
                    {program.name}
                    <button
                        onClick={onClose}
                        className="tw-absolute tw-top-4 tw-right-4 tw-text-white hover:tw-opacity-70"
                    >
                        ✖
                    </button>
                </div>
                <div className="tw-p-6">
                    <img
                        src={program.image}
                        alt={program.name}
                        className="tw-w-full tw-h-48 tw-object-cover tw-rounded-lg tw-mb-4"
                    />
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Description:</span> {program.description}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Age:</span> {program.age}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Time:</span> {program.time}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Capacity:</span> {program.capacity}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Prices:</span> {program.price || "Contact us for pricing"}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555]">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Skills to Develop:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula ex nec erat congue, sit amet lacinia neque gravida.<br/>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula ex nec erat congue, sit amet lacinia neque gravida.<br/>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula ex nec erat congue, sit amet lacinia neque gravida.<br/>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vehicula ex nec erat congue, sit amet lacinia neque gravida.<br/>
                    </p>
                </div>
                <div className="tw-p-6 tw-text-center">
                <button
                        onClick={onClose}
                        className="tw-py-2 tw-px-4 tw-bg-[#FFC909] tw-text-[#9C29B2] tw-font-bold tw-rounded-full hover:tw-bg-[#FFE57A] tw-transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramModal;