import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { BookOpen } from 'lucide-react';
import book from "../../img/books.png";
import littleexplorers from "../../img/little-explorers.jpg";
import dancing from "../../img/dancing.jpg";
import Scientists from "../../img/LittleScientist.jpg";
import kids4C from "../../img/kids4C.png";
import { useNavigate } from 'react-router-dom';
import { defaultPrograms } from "./Programs.jsx"

export const Allprograms = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const allPrograms = [...defaultPrograms, ...(store.programs || [])];

    useEffect(() => {
        actions.getPrograms();
    }, [actions]);

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

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
                {allPrograms.map((programItem) => (
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
                                <span className="tw-font-bold tw-text-[#9C29B2]">Description:</span>{" "}
                                {programItem.description}
                            </p>

                            {/* Etiquetas */}
                            <div className="tw-flex tw-justify-between tw-items-center tw-gap-4 tw-my-5">
                                <div className="tw-flex tw-items-center tw-bg-gradient-to-r tw-from-[#FFC909] tw-to-[#FFE57A] tw-px-3 tw-py-2 tw-rounded-lg tw-shadow-md">
                                    <span className="tw-text-[#9C29B2] tw-font-bold tw-mr-2">
                                        <i className="fas fa-baby tw-mr-1"></i> Age:
                                    </span>
                                    <span className="tw-text-sm tw-text-[#555] tw-font-bold">{programItem.age}</span>
                                </div>
                                <div className="tw-flex tw-items-center tw-bg-gradient-to-r tw-from-[#FFC909] tw-to-[#FFE57A] tw-px-3 tw-py-2 tw-rounded-lg tw-shadow-md">
                                    <span className="tw-text-[#9C29B2] tw-font-bold tw-mr-2">
                                        <i className="fas fa-clock tw-mr-1"></i> Time:
                                    </span>
                                    <span className="tw-text-sm tw-text-[#555] tw-font-bold">{programItem.time}</span>
                                </div>
                                <div className="tw-flex tw-items-center tw-bg-gradient-to-r tw-from-[#FFC909] tw-to-[#FFE57A] tw-px-3 tw-py-2 tw-rounded-lg tw-shadow-md">
                                    <span className="tw-text-[#9C29B2] tw-font-bold tw-mr-2">
                                        <i className="fas fa-users tw-mr-1"></i> Capacity:
                                    </span>
                                    <span className="tw-text-sm tw-text-[#555] tw-font-bold">{programItem.capacity}</span>
                                </div>
                            </div>

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