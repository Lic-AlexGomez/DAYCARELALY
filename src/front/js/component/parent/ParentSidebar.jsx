import { NavLink } from "react-router-dom";
import { Home, Users, Calendar, Activity, CreditCard, Settings, Video, MessageCircle, School, Menu } from "lucide-react";
import React, { useState, useContext,useEffect } from "react"
import { Link , useNavigate} from "react-router-dom"
import { Context } from "../../store/appContext"

const menuItems = [
  { icon: Home, label: "Home", path: "/parent-dashboard" },
  { icon: Users, label: "My Children", path: "/parent-dashboard/children" },
  { icon: Calendar, label: "Schedule", path: "/parent-dashboard/schedule" },
  { icon: Activity, label: "Activities", path: "/parent-dashboard/activities" },
  { icon: CreditCard, label: "Payments", path: "/parent-dashboard/payments" },
  { icon: CreditCard, label: "Payment History", path: "/parent-dashboard/payment-history" },
  { icon: Video, label: "Virtual Classes", path: "/parent-dashboard/virtual-classes" },
  { icon: MessageCircle, label: "Messages", path: "/parent-dashboard/messages" },
  { icon: School, label: "Enroll Classes", path: "/parent-dashboard/virtual-classes-enroll" },
  { icon: Settings, label: "Configuration", path: "/parent-dashboard/settings" },
];

const ParentSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { store,actions } = useContext(Context)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    actions.getPrivate("paren");
    },[])
  useEffect(() =>  {

    if(store.paren === false){
      navigate("/login")
    }else{
      // console.log("parent is logged in",store.paren)
    }
  }, [store.paren])
  
  return (
    <>
      {/* Botón de Menú para Móviles */}
      <button
        onClick={toggleSidebar}
        className="tw-fixed tw-top-3 tw-left-4 tw-z-50 tw-p-2 tw-bg-white tw-rounded-lg tw-shadow-md sm:tw-hidden"
      >
        <Menu className="tw-w-6 tw-h-6 " />
      </button>

      {/* Barra Lateral */}
      <nav
        className={`tw-bg-white tw-w-64 tw-h-full tw-border-r tw-border-gray-200 tw-fixed sm:tw-relative tw-transform ${
          isSidebarOpen ? "tw-translate-x-0" : "-tw-translate-x-full"
        } sm:tw-translate-x-0 tw-transition-transform tw-duration-200 tw-ease-in-out tw-z-40`}
      >
        <div className="tw-flex tw-items-center tw-justify-center tw-h-14 tw-border-b tw-border-gray-200 ">
          <span className="tw-text-lg tw-font-semibold tw-text-gray-800">Daycare Slime Co.</span>
        </div>
        <div className="tw-p-4">
          <ul className="tw-space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className="tw-flex tw-items-center tw-p-2 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-100"
  
                >
                  <item.icon className="tw-w-5 tw-h-5 tw-mr-3" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>


      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 sm:tw-hidden tw-z-30"
        ></div>
      )}
    </>
  );
};

export default ParentSidebar;