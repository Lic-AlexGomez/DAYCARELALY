import React, { useContext, useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import Swal from "sweetalert2";

const VirtualClasses = () => {
    const { store, actions } = useContext(Context);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [newClass, setNewClass] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        teacher: 0,
        capacity: '',
        price: '',
        meet_link: ''
    });

    useEffect(() => {
        actions.fetchVirtualClasses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingClass) {
            setEditingClass({ ...editingClass, [name]: value });
        } else {
            setNewClass({ ...newClass, [name]: value });
        }
    };


    const handleAddVirtualClass = async (e) => {
        e.preventDefault();


        if (newClass.teacher === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please, Select a teacher.',
            });
            return;
        }

        const confirmSubmit = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this virtual class?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, add!",
            cancelButtonText: "No, cancel",
        });

        if (!confirmSubmit.isConfirmed) {
            return;
        }

        try {
            const result = await actions.addVirtualClass(
                newClass.name,
                newClass.description,
                newClass.date,
                newClass.time,
                newClass.duration,
                newClass.teacher,
                newClass.capacity,
                newClass.price,
                newClass.meet_link
            );

            if (result) {
                Swal.fire({
                    icon: "success",
                    title: " Virtual Class Added",
                    text: "A new  virtual class has been added!",
                });
                actions.getVirtualClasses();
                setNewClass({
                    name: '',
                    description: '',
                    date: '',
                    time: '',
                    duration: '',
                    teacher: 0,
                    capacity: '',
                    price: '',
                    meet_link: ''
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `There was an error: ${result.error}`,
                });
            }
        } catch (error) {
            console.error("Error in handleAddVirtualClass:", error);
            Swal.fire({
                icon: "error",
                title: "Submission Error",
                text: "There was an error submitting the form. Please try again.",
            });
        }
    };

    const handleEditClass = (classes) => {
        setEditingClass(classes);
        setIsModalOpen(true);
    };

    const handleUpdateVirtualClass = async (e) => {
        e.preventDefault();
        await actions.updateVirtualClass(editingClass.id, editingClass);
        setIsModalOpen(false);
        setEditingClass(null);
    };

    const handleDeleteClass = async (id) => {
        const confirmDelete = await Swal.fire({
            title: '¿You are sure?',
            text: "This action cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const result = await actions.deleteVirtualClass(id);

                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Virtual class delete',
                        text: 'The class has been successfully deleted.',
                    });
                    actions.fetchVirtualClasses();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'There was an error deleting the class.',
                    });
                }
            } catch (error) {
                console.error("Error en handleDeleteVirtualClass:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error trying to delete the class. Try again.',
                });
            }
        }
    };

    const getTeachers = async () => {
        await actions.fetchTeachersClasses();
        setTeachers(store.teachersClasses);
    };

    useEffect(() => {
        getTeachers();
    }, []);

    return (
        <div className="tw-p-4">
            <h2 className="tw-text-2xl tw-font-semibold tw-mb-6"> Virtual Class Management</h2>
            <div className="tw-mb-6">
                <form onSubmit={handleAddVirtualClass} className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-6">
                    <div>
                        <div className='tw-flex-1'>
                            <label htmlFor="teacher" className='tw-block tw-mb-2'>Teacher</label>
                            <select
                                name="teacher"
                                onChange={handleInputChange}
                                value={newClass.teacher}
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                            >
                                <option value={0} disabled>Select an Teacher</option>
                                {teachers.map(item => (
                                    <option key={`teacher-${item.id}`} value={item.id}>{item.username}</option>
                                ))}
                            </select>
                        </div>
                        <div className='tw-flex-1'>
                            <label htmlFor="name" className='tw-block tw-mb-2'>Class name</label>
                            <input
                                type="text"
                                name="name"
                                value={newClass.name}
                                onChange={handleInputChange}
                                placeholder="Name of the class"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>
                        <div className='tw-flex-1'>
                            <label htmlFor="description" className='tw-block tw-mb-2'>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={newClass.description}
                                onChange={handleInputChange}
                                placeholder="Description of the class"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>
                        <div className='tw-flex-1'>
                            <label htmlFor="capacity" className='tw-block tw-mb-2'>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={newClass.capacity}
                                onChange={handleInputChange}
                                placeholder="Capacity"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className='tw-flex-1'>
                            <label htmlFor="price" className='tw-block tw-mb-2'>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={newClass.price}
                                onChange={handleInputChange}
                                placeholder="Price"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>

                        <div className='tw-flex-1'>
                            <label htmlFor="time" className='tw-block tw-mb-2'>Time</label>
                            <input
                                type="text"
                                name="time"
                                value={newClass.time}
                                onChange={handleInputChange}
                                placeholder="Age Range"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>

                        <div className='tw-flex-1'>
                            <label htmlFor="duration" className='tw-block tw-mb-2'>Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={newClass.duration}
                                onChange={handleInputChange}
                                placeholder="Schedule"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>
                        <div className='tw-flex-1'>
                            <label htmlFor="date" className='tw-block tw-mb-2'>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={newClass.date}
                                onChange={handleInputChange}
                                placeholder="Schedule"
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>

                        <div className='tw-flex-1'>
                            <label htmlFor="meet_link" className='tw-block tw-mb-2'>Meet Link </label>
                            <input
                                type="text"
                                name="meet_link"
                                value={newClass.meet_link}
                                onChange={handleInputChange}
                                className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                required
                            />
                        </div>
                    </div>

                    <div className='tw-flex'>
                        <button
                            type="submit"
                            className="tw-col-span-2 sm:tw-col-span-1 tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center"
                        >
                            <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
                            Add Class
                        </button>
                    </div>
                </form>
            </div>
            <div className="tw-overflow-x-auto">
                <table className="tw-w-full tw-bg-white tw-shadow-md tw-rounded-lg">
                    <thead className="tw-bg-gray-100">
                        <tr>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Name</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Description</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Date</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Meet Link</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Duration</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Teacher</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Capacity</th>
                            <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="tw-divide-y tw-divide-gray-200">
                        {/* {console.log(store.virtualClasses)} */}
                        {store.virtualClasses.map((classItem) => (
                            <tr key={classItem.id}>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.name}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.description}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.date}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.meet_link}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.duration}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.teacher}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">{classItem.capacity}</td>
                                <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                                    <button className="tw-text-blue-600 hover:tw-text-blue-900 tw-mr-3" onClick={() => handleEditClass(classItem)}>
                                        <Edit className="tw-w-5 tw-h-5" />
                                    </button>
                                    <button className="tw-text-red-600 hover:tw-text-red-900" onClick={() => handleDeleteClass(classItem.id)}>
                                        <Trash className="tw-w-5 tw-h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="tw-fixed tw-inset-0 tw-bg-gray-600 tw-bg-opacity-50 tw-overflow-y-auto tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center">
                    <div className="tw-bg-white tw-p-8 tw-rounded-md tw-shadow-lg tw-w-full md:tw-w-1/2 lg:tw-w-1/3">
                        <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
                            <h3 className="tw-text-xl tw-font-semibold">Edit Virtual Class</h3>
                            <button onClick={() => setIsModalOpen(false)} className="tw-text-gray-500 hover:tw-text-gray-700">
                                <X className="tw-w-6 tw-h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateVirtualClass} className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-6">
                            <div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="teacher" className='tw-block tw-mb-2'>Teacher</label>
                                    <select
                                        name="teacher"
                                        onChange={handleInputChange}
                                        value={editingClass.teacher}
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                    >
                                        <option value={0} disabled>Select an Teacher</option>
                                        {teachers.map(item => (
                                            <option key={`teacher-${item.id}`} value={item.id}>{item.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="name" className='tw-block tw-mb-2'>Class name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingClass.name}
                                        onChange={handleInputChange}
                                        placeholder="Name of the class"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="description" className='tw-block tw-mb-2'>Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={editingClass.description}
                                        onChange={handleInputChange}
                                        placeholder="Description of the class"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="capacity" className='tw-block tw-mb-2'>Capacity</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={editingClass.capacity}
                                        onChange={handleInputChange}
                                        placeholder="Capacity"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="price" className='tw-block tw-mb-2'>Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editingClass.price}
                                        onChange={handleInputChange}
                                        placeholder="Price"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>

                                <div className='tw-flex-1'>
                                    <label htmlFor="time" className='tw-block tw-mb-2'>Time</label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={editingClass.time}
                                        onChange={handleInputChange}
                                        placeholder="Age Range"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>

                                <div className='tw-flex-1'>
                                    <label htmlFor="duration" className='tw-block tw-mb-2'>Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={editingClass.duration}
                                        onChange={handleInputChange}
                                        placeholder="Schedule"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>
                                <div className='tw-flex-1'>
                                    <label htmlFor="date" className='tw-block tw-mb-2'>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={editingClass.date}
                                        onChange={handleInputChange}
                                        placeholder="Schedule"
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>

                                <div className='tw-flex-1'>
                                    <label htmlFor="meet_link" className='tw-block tw-mb-2'>Meet Link </label>
                                    <input
                                        type="text"
                                        name="meet_link"
                                        value={editingClass.meet_link}
                                        onChange={handleInputChange}
                                        className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2"
                                        required
                                    />
                                </div>
                            </div>

                            <div className='tw-flex'>
                                <button
                                    type="submit"
                                    className="tw-col-span-2 sm:tw-col-span-1 tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-justify-center"
                                >
                                    <Plus className="tw-w-5 tw-h-5 tw-mr-2" />
                                    update Virtual Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualClasses;