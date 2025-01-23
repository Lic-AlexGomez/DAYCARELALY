import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import kids4C from "../../img/kids4C.png";
import { useNavigate } from 'react-router-dom';
import { defaultPrograms } from "./Programs.jsx"

export const Allprograms = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const [selectedAge, setSelectedAge] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const allPrograms = [...defaultPrograms, ...(store.programs || [])];

    useEffect(() => {
        actions.getPrograms();
    }, [actions]);

    const uniqueAges = [...new Set(allPrograms.map((program) => program.age))];

    const filteredPrograms = allPrograms.filter((program) =>
        selectedAge ? program.age === selectedAge : true
    );

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleAgeChange = (e) => {
        setSelectedAge(e.target.value);
    };

    return (
        <div className="tw-container tw-mx-auto tw-px-4 tw-text-center tw-mb-12">
    <div className="tw-relative tw-inline-block tw-py-4">
        <h2
            className="tw-text-4xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-[#9C29B2] tw-to-[#FFC909]"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
            <br />
            All Our Programs
        </h2>
        <div className="tw-absolute tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-mt-2 tw-h-1 tw-w-3/4 tw-bg-gradient-to-r tw-from-[#FFC909] tw-to-[#9C29B2] tw-rounded-full"></div>
    </div>

    <h3 className="tw-text-lg tw-mt-4 tw-text-[#555] tw-italic tw-opacity-90">
        "Discover the programs designed to enhance your child's development and learning"
        <br />
        <br />
    </h3>
    <div className="tw-flex tw-justify-end tw-mb-6">
        <div className="tw-relative tw-inline-block tw-text-left">
            <button
                className="tw-py-2 tw-px-4 tw-bg-[#FFC909] tw-text-[#9C29B2] tw-font-bold tw-rounded-full hover:tw-bg-[#FFE57A] tw-transition-colors"
                onClick={toggleDropdown}
            >
                Filter by Age ▼
            </button>

            {isDropdownOpen && (
                <div className="tw-absolute tw-right-0 tw-mt-2 tw-w-56 tw-bg-white tw-shadow-lg tw-rounded-lg tw-z-10">
                    <div className="tw-p-4">
                        <label className="tw-block tw-mb-3">
                            <span className="tw-text-sm tw-font-bold tw-text-[#9C29B2]">Select Age:</span>
                            <select
                                value={selectedAge}
                                onChange={handleAgeChange}
                                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mt-1"
                            >
                                <option value="">All</option>
                                {uniqueAges.map((age) => (
                                    <option key={age} value={age}>
                                        {age}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            )}
        </div>
    </div>

    {/* Tarjetas filtradas */}
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
        {filteredPrograms.map((programItem) => (
            <div
                key={programItem.id}
                className="tw-bg-white tw-rounded-3xl tw-overflow-hidden tw-shadow-lg tw-border tw-border-[#9C29B2]"
            >
                <div className="tw-aspect-w-16 tw-aspect-h-9">
                    <img
                        src={programItem.image || kids4C}
                        alt={programItem.name}
                        className="tw-w-full tw-h-full tw-object-cover"
                    />
                </div>
                <div className="tw-p-6">
                    <h3
                        className="tw-text-2xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-[#9C29B2] tw-to-[#FFC909] tw-mb-3"
                        style={{ fontFamily: "'Fredoka', sans-serif" }}
                    >
                        {programItem.name}
                    </h3>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555] tw-opacity-90 tw-text-left">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Description:</span> {programItem.description}
                    </p>
                    <p className="tw-text-sm tw-mb-2 tw-text-[#555] tw-text-left">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Age:</span> {programItem.age}
                    </p>
                    <p className="tw-text-sm tw-mb-2 tw-text-[#555] tw-text-left">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Time:</span> {programItem.time}
                    </p>
                    <p className="tw-text-sm tw-mb-4 tw-text-[#555] tw-text-left">
                        <span className="tw-font-bold tw-text-[#9C29B2]">Capacity:</span> {programItem.capacity}
                    </p>
                    <button className="tw-w-full tw-py-2 tw-border tw-border-[#FFC909] tw-rounded-full tw-bg-[#FFC909] tw-text-[#9C29B2] tw-font-bold hover:tw-bg-[#FFE57A] tw-transition-colors">
                        Read more
                    </button>
                </div>
            </div>
        ))}
    </div>
</div>
    );
};

export default Allprograms;