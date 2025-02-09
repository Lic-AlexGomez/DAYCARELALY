import React, { useEffect, useContext, useState } from "react";
import { Clock, Calendar, Activity } from "lucide-react"; // Importar íconos
import { Context } from "../../store/appContext";

const ParentSchedule = () => {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      await actions.fetchParentSchedule();
      setIsLoading(false);
    };
    loadSchedule();
  }, []);

  if (isLoading) {
    return <div>Loading schedule...</div>;
  }
  console.log(store.enrolledClasses);

  return (
    <div className="tw-p-4">
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Weekly Schedule</h3>
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-5 tw-gap-4">
        {store.parentSchedule.map((schedule) => (
          <div
            key={schedule.id}
            className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-4 tw-border tw-border-gray-100 tw-transition tw-transform tw-hover:scale-105 tw-hover:shadow-lg"
          >
            
            <div className="tw-flex tw-items-center tw-mb-4">
              <Calendar className="tw-w-5 tw-h-5 tw-mr-2 tw-text-blue-500" />
              <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                {schedule.day}
              </h4>
            </div>

            
            <div className="tw-mb-4">
              <div className="tw-flex tw-items-center tw-mb-2">
                <Activity className="tw-w-5 tw-h-5 tw-mr-2 tw-text-green-500" />
                <h5 className="tw-text-md tw-font-semibold tw-text-gray-700">
                  Activities:
                </h5>
              </div>
              <ul className="tw-list-disc tw-list-inside tw-text-gray-600">
                {schedule.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>

           
            <div className="tw-flex tw-items-center">
              <Clock className="tw-w-5 tw-h-5 tw-mr-2 tw-text-purple-500" />
              <span className="tw-text-sm tw-text-gray-500">9:00 AM - 5:00 PM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentSchedule;