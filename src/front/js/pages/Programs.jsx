import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { BookOpen } from 'lucide-react';
import book from "../../img/books.png";
import littleexplorers from "../../img/little-explorers.jpg";
import dancing from "../../img/dancing.jpg";
import Scientists from "../../img/LittleScientist.jpg";
import kids4C from "../../img/kids4C.png";
import { useNavigate } from 'react-router-dom';
import ProgramModal from "../component/ProgramsModal.jsx"


export const defaultPrograms = [
    {
        id: 111111111,
        name: "Little Explorers ",
        price: "25",
        description: "A hands-on program featuring activities like building with blocks, painting, sensory games (sand, water), and group play.",
        age: "3-5 Years",
        time: "8-10 am",
        capacity: "15 Kids",
        image: littleexplorers,
    },
    {
        id: 2222222222,
        name: "Learning with Rhythm",
        price: "25",
        description: "Musical activities such as singing, playing basic instruments (maracas, tambourines), and learning rhythms through body games.",
        age: "3-4 Years",
        time: "9-11 am",
        capacity: "15 Kids",
        image: dancing,
    },
    {
        id: 333333333333,
        name: "Little Scientists",
        price: "35",
        description: "Stimulate curiosity and critical thinking through basic science experiments and activities through playing with different elements.",
        age: "3-5 Years",
        time: "8-10 am",
        capacity: "10 Kids",
        image: Scientists,
    },
    {
        id: 44444444444,
        name: "Creative Minds",
        price: "30",
        description: "Exploring creative thinking and hands-on activities in arts, crafts, and problem-solving.",
        age: "4-5 Years",
        time: "10-12 am",
        capacity: "12 Kids",
        image: book,
    },
    {
        id: 5555555555555,
        name: "Nature Explorers",
        price: "28",
        description: "An outdoor program focused on exploring nature, identifying plants and animals, and engaging in outdoor play and learning.",
        age: "4-6 Years",
        time: "9-11 am",
        capacity: "12 Kids",
        image: littleexplorers,
    },
    {
        id: 6666666666666,
        name: "Artistic Adventures",
        price: "30",
        description: "A creative program where kids learn to express themselves through painting, sculpture, and crafts.",
        age: "3-5 Years",
        time: "8-10 am",
        capacity: "15 Kids",
        image: dancing,
    },
    {
        id: 77777777777,
        name: "Tech Tots",
        price: "35",
        description: "Introduce young minds to basic technology concepts using age-appropriate tools and games.",
        age: "5-6 Years",
        time: "10-12 am",
        capacity: "10 Kids",
        image: Scientists,
    },
    {
        id:88888888888888,
        name: "Mini Chefs",
        price: "30",
        description: "A fun and educational program where kids learn basic cooking skills and food safety.",
        age: "4-6 Years",
        time: "11 am - 1 pm",
        capacity: "10 Kids",
        image: kids4C,
    }
];
export const Programs = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visiblePrograms, setVisiblePrograms] = useState(3);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const allPrograms = [...defaultPrograms, ...(store.programs || [])];

    const programsPerPage = 3;

    const goToNext = () => {
        if (currentIndex < Math.ceil(allPrograms.length / programsPerPage) - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const startIndex = currentIndex * programsPerPage;
    const endIndex = startIndex + programsPerPage;

    const handleShowMore = () => {
        setVisiblePrograms((prev) => prev + 3);
    };

    useEffect(() => {
        actions.getPrograms();
    }, []);

    const openModal = (program) => {
        setSelectedProgram(program);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProgram(null);
    };

    return (
        <div className="tw-container tw-mx-auto tw-px-4 tw-text-center tw-mb-12">
            <div className="tw-relative tw-inline-block tw-py-4">
                <h2
                    className="tw-text-4xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-[#9C29B2] tw-to-[#FFC909]"
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                    <br />
                    Our Programs
                </h2>
                <div className="tw-absolute tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-mt-2 tw-h-1 tw-w-3/4 tw-bg-gradient-to-r tw-from-[#FFC909] tw-to-[#9C29B2] tw-rounded-full"></div>
            </div>
            <h3 className="tw-text-lg tw-mt-4 tw-text-[#555] tw-italic tw-opacity-90">
                "Discover the programs designed to enhance your child's development and learning"
                <br />
                <br />
            </h3>

            {/* Carousel de Programas */}
            <div className="tw-relative">
                {currentIndex > 0 && (
                    <button
                        onClick={goToPrev}
                        className="tw-absolute tw-top-1/2 tw-left-0 tw-transform tw--translate-y-1/2 tw-bg-white tw-px-3 tw-py-2 tw-rounded-full tw-shadow-lg tw-text-[#9C29B2]"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                )}

                {/* Programas en el Carousel */}
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 tw-overflow-hidden">
                    {allPrograms.slice(startIndex, endIndex).map((programItem) => (
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

                                <button
                                onClick={() => openModal(programItem)}
                                className="tw-w-full tw-py-2 tw-border tw-border-[#FFC909] tw-rounded-full tw-bg-[#FFC909] tw-text-[#9C29B2] tw-font-bold hover:tw-bg-[#FFE57A] tw-transition-colors"
                            >
                                Read More
                            </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón Siguiente */}
                {currentIndex < Math.ceil(allPrograms.length / programsPerPage) - 1 && (
                    <button
                        onClick={goToNext}
                        className="tw-absolute tw-top-1/2 tw-right-0 tw-transform tw--translate-y-1/2 tw-bg-white tw-px-3 tw-py-2 tw-rounded-full tw-shadow-lg tw-text-[#9C29B2]"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                )}
            </div>

            <div className="tw-text-center tw-mt-12">
                <button
                    className="tw-bg-[#9C29B2] tw-text-white tw-px-12 tw-py-4 tw-rounded-full tw-text-lg tw-font-bold hover:tw-bg-[#7A1D8D] tw-transition-colors"
                    onClick={() => navigate('/allprograms')}
                >
                    Discover All Programs
                </button>
            </div>
              <ProgramModal
                                        program={selectedProgram}
                                        isOpen={isModalOpen}
                                        onClose={closeModal}
                                    />
        </div>
    );
};

export default Programs;
