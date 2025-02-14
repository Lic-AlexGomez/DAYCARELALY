import React, { useEffect, useContext, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";

const ParentActivities = () => {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        await Promise.all([
          actions.fetchParentData(),
          actions.fetchParentChildren(),
          actions.fetchParentActivities(),
          actions.fetchParentPayments(),
          actions.fetchParentVirtualClasses(),
          
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, [actions.fetchParentActivities]);

  useEffect(() => {
      actions.fetchEvents();
    }, []);

  if (isLoading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-text-lg tw-font-semibold tw-text-gray-700">
          Loading activities...
        </div>
      </div>
    );
  }


  // if (!Array.isArray(store.parentActivities)) {
  //   console.error("store.parentActivities is not an array:", store.parentActivities);
  //   return (
  //     <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
  //       <div className="tw-text-lg tw-font-semibold tw-text-gray-700">
  //           No activities found.
  //       </div>
  //     </div>
  //   );
  // }

  // if (store.parentActivities.length === 0) {
  //   return (
  //     <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
  //       <div className="tw-text-lg tw-font-semibold tw-text-gray-700">
  //         No activities found.
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <h3 className="tw-text-xl tw-font-semibold tw-mb-6">Activities</h3>
      <div className="tw-space-y-4">
        {store.events.map((activity) => (
          <div key={activity.id} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-2">{activity.name}</h4>
            <div className="tw-flex tw-items-center tw-mb-2">
              <Calendar className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.start_time}</span>
            </div>
            {/* <div className="tw-flex tw-items-center tw-mb-2">
              <Clock className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>
                {activity.time} - Duration: {activity.duration}
              </span>
            </div>
            <div className="tw-flex tw-items-center tw-mb-2">
              <MapPin className="tw-w-5 tw-h-5 tw-text-gray-500 tw-mr-2" />
              <span>{activity.location}</span>
            </div> */}
            {/* <div className="tw-mt-2">
              <span
                className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-sm tw-font-semibold
                  ${
                    activity.status === "scheduled"
                      ? "tw-bg-blue-100 tw-text-blue-800"
                      : activity.status === "completed"
                        ? "tw-bg-green-100 tw-text-green-800"
                        : "tw-bg-red-100 tw-text-red-800"
                  }`}
              >
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span> */}
            {/* </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentActivities;