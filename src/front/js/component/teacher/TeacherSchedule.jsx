import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Clock, Calendar } from "lucide-react";

const TeacherSchedule = () => {
  const { store, actions } = useContext(Context);
  const { teacherClasses } = store;
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    const savedSchedule = localStorage.getItem("teacherSchedule");
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule)); 
    } else if (teacherClasses) {
      setSchedule(teacherClasses); 
    }
  }, [teacherClasses]);
  useEffect(() => {
    if (schedule.length > 0) {
      localStorage.setItem("teacherSchedule", JSON.stringify(schedule)); 
    }
  }, [schedule]);

  return (
    <div className="tw-p-4">
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">My Schedule</h3>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-5 tw-gap-4">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-border tw-border-gray-100 tw-transition tw-transform tw-hover:scale-105 tw-hover:shadow-lg"
          >
            <div className="tw-flex tw-items-center tw-mb-4">
              <Calendar className="tw-w-5 tw-h-5 tw-mr-2 tw-text-blue-500" />
              <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">{item.name}</h4>
            </div>

            <div className="tw-flex tw-items-center tw-mb-2">
              <Clock className="tw-w-5 tw-h-5 tw-mr-2 tw-text-purple-500" />
              <span className="tw-text-sm tw-text-gray-500">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSchedule;
