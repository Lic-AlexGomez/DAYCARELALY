import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Search, Edit, Trash } from "lucide-react";

const TeacherStudents = () => {
  const { store, actions } = useContext(Context);
  const { teacherStudents } = store;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    actions.getStudentsByTeacher();
  }, []);

  const filteredStudents = teacherStudents.filter((student) =>
    student.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-4">My Students</h3>
      <div className="tw-mb-4">
        <div className="tw-relative">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pl-10 tw-pr-4 tw-py-2"
          />
          <Search className="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
        </div>
      </div>
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
          <thead className="tw-bg-gray-50">
            <tr>
              <th className="tw-px-6 tw-py-3 tw-text-center">Name</th>
              <th className="tw-px-6 tw-py-3 tw-text-center">Class</th>
              <th className="tw-px-6 tw-py-3 tw-text-center">Enrolled At</th>
              <th className="tw-px-6 tw-py-3 tw-text-center">Class Time</th>
              <th className="tw-px-6 tw-py-3 tw-text-center">Class Capacity</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="tw-px-6 tw-py-4 tw-text-center">{student.child_name}</td>
                <td className="tw-px-6 tw-py-4 tw-text-center">{student.class_name}</td>
                <td className="tw-px-6 tw-py-4 tw-text-center">{student.enrolled_at}</td>
                <td className="tw-px-6 tw-py-4 tw-text-center">{student.time}</td>
                <td className="tw-px-6 tw-py-4 tw-text-center">{student.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudents;
