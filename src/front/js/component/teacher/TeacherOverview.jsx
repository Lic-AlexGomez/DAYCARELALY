import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Users, BookOpen, CheckSquare, Clock } from "lucide-react";

const TeacherOverview = () => {
  const { store, actions } = useContext(Context);
  const { teacherStudents, teachersClasses } = store; 
  const [studentCount, setStudentCount] = useState(0);
  const [assignedClassCount, setAssignedClassCount] = useState(0);

  useEffect(() => {
    actions.getStudentsByTeacher();
    actions.fetchTeachersClasses();
  }, []);

  useEffect(() => {
    setStudentCount(teacherStudents?.length || 0);
  }, [teacherStudents]);

  useEffect(() => {
    setAssignedClassCount(teachersClasses?.length || 0);
  }, [teachersClasses]); 

  const stats = [
    { title: "Total Students", value: studentCount, icon: Users, color: "tw-bg-blue-500" },
    { title: "Assigned Classes", value: assignedClassCount, icon: BookOpen, color: "tw-bg-green-500" },
    { title: "Pending Tasks", value: "Coming Soon", icon: CheckSquare, color: "tw-bg-gray-400" },
    { title: "Class Hours", value: "Coming Soon", icon: Clock, color: "tw-bg-gray-400" },
  ];

  return (
    <div className="tw-p-6">
      <div className="tw-grid tw-grid-cols-4 tw-md:grid-cols-2 tw-lg:grid-cols-4 tw-gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <div className="tw-flex tw-items-center">
              <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
                <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
              </div>
              <div className="tw-ml-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700">{stat.title}</h4>
                <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="tw-mt-8">
        <h4 className="tw-text-lg tw-font-semibold tw-mb-4">Upcoming Classes</h4>
        <ul className="tw-space-y-2">
          <li className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <p className="tw-font-semibold">Art Class</p>
            <p className="tw-text-sm tw-text-gray-600">Today, 10:00 AM - 11:30 AM</p>
          </li>
          <li className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4">
            <p className="tw-font-semibold">Music Class</p>
            <p className="tw-text-sm tw-text-gray-600">Morning, 2:00 PM - 3:30 PM</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherOverview;