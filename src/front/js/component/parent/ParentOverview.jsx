import React, { useEffect, useContext, useState } from "react";
import { Users, Activity, CreditCard, Video, Clock } from "lucide-react"; // Importar íconos
import { Context } from "../../store/appContext";

const ParentOverview = () => {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [dataActivities, setDataActivities] = useState(false);
  
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
       
         await Promise.all([
         await actions.fetchParentData(),
         await actions.fetchParentChildren(),
         await actions.fetchParentActivities(),
         await actions.fetchParentPayments(),
         await actions.fetchParentVirtualClasses(),
         await setDataActivities(store.parentActivities || false)
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, [store, actions.fetchParentChildren, actions.fetchParentActivities, actions.fetchParentPayments, actions.fetchParentVirtualClasses]);

  if (isLoading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-64">
        <div className="tw-text-lg tw-font-semibold tw-text-gray-700">
          Loading overview...
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Hijos Inscritos",
      value: store.parentChildren.length,
      icon: Users,
      color: "tw-bg-blue-500",
    },
    {
      title: "Actividades Próximas",
      value: store.parentActivities.length,
      icon: Activity,
      color: "tw-bg-green-500",
    },
    {
      title: "Pagos Pendientes",
      value: store.parentPayments.filter((p) => p.status === "Pendiente").length,
      icon: CreditCard,
      color: "tw-bg-yellow-500",
    },
    {
      title: "Clases Virtuales",
      value: store.parentVirtualClasses.length,
      icon: Video,
      color: "tw-bg-purple-500",
    },
  ];

  return (
    <div className="tw-p-4">
      <h3 className="tw-text-2xl tw-font-semibold tw-mb-6">Parent Summary</h3>

      {/* Tarjetas de estadísticas */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="tw-bg-white tw-rounded-xl tw-shadow-lg tw-p-6 tw-transition tw-transform tw-hover:scale-105 tw-hover:shadow-xl"
          >
            <div className="tw-flex tw-items-center">
              <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
                <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
              </div>
              <div className="tw-ml-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700">
                  {stat.title}
                </h4>
                <p className="tw-text-3xl tw-font-bold tw-text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de actividades recientes */}
      <div className="tw-mt-10">
        <h4 className="tw-text-xl tw-font-semibold tw-mb-7 ">Recent Activities</h4>
        <ul className="tw-space-y-4">
        {dataActivities.length > 0 ? (
            dataActivities.slice(0, 3).map((activity, index) => (
              <li
                key={index}
                className="tw-bg-white tw-rounded-xl tw-shadow-md tw-p-5 tw-transition tw-transform tw-hover:scale-102 tw-hover:shadow-lg"
              >
                <div className="tw-flex tw-items-center">
                  <Clock className="tw-w-5 tw-h-5 tw-mr-3 tw-text-gray-500" />
                  <div>
                    <p className="tw-text-lg tw-font-semibold tw-text-gray-800">
                      {activity.name}
                    </p>
                    <p className="tw-text-sm tw-text-gray-600">
                      {activity.date} - {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>No activities found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ParentOverview;