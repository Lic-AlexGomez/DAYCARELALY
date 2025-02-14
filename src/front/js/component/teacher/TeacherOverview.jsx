import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Users, BookOpen, CheckSquare, Clock } from "lucide-react";

const TeacherOverview = () => {
  const { store, actions } = useContext(Context);
  const { teacherStudents, teacherClasses } = store;
  const [studentCount, setStudentCount] = useState(0);
  const [assignedClassCount, setAssignedClassCount] = useState(0);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar carga de datos

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherStudents || teacherStudents.length === 0) {
        await actions.getStudentsByTeacher();
      }
      if (!teacherClasses || teacherClasses.length === 0) {
        await actions.getTeacherClasses();
      }
      setLoading(false); // Indicar que los datos ya están cargados
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (teacherStudents) {
      setStudentCount(teacherStudents.length || 0);
    }
  }, [teacherStudents]);

  useEffect(() => {
    if (teacherClasses) {
      setAssignedClassCount(teacherClasses.length || 0);
    }
  }, [teacherClasses]);

  // Datos de las tarjetas
  const stats = [
    { title: "Total Students", value: studentCount, icon: Users, color: "tw-bg-blue-500" },
    { title: "Assigned Classes", value: assignedClassCount, icon: BookOpen, color: "tw-bg-green-500" },
    { title: "Pending Tasks", value: "Coming Soon", icon: CheckSquare, color: "tw-bg-gray-400" },
    { title: "Class Hours", value: "Coming Soon", icon: Clock, color: "tw-bg-gray-400" },
  ];

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-4">Teacher Overview</h3>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4">
          {stats.map((stat, index) => (
            <div key={index} className={`tw-p-4 tw-rounded-lg tw-shadow-md ${stat.color}`}>
              <div className="tw-flex tw-items-center tw-gap-4">
                <stat.icon className="tw-text-white tw-w-6 tw-h-6" />
                <div>
                  <p className="tw-text-white tw-text-sm">{stat.title}</p>
                  <p className="tw-text-white tw-text-lg tw-font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherOverview;
