import React,{useEffect,useContext} from "react"
import {Context} from "../../store/appContext"
import { NavLink , useNavigate} from "react-router-dom"
import { Home, Users, BookOpen, CheckSquare, Calendar, Settings,Video,MessageCircle } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", path: "/teacher-dashboard" },
  { icon: BookOpen, label: "My Classes", path: "/teacher-dashboard/classes" },
  { icon: Users, label: "Students", path: "/teacher-dashboard/students" },
  // { icon: CheckSquare, label: "Assignments", path: "/teacher-dashboard/assignments" },
  { icon: Video, label: "Virtual Classes", path: "/teacher-dashboard/teachervirtualclasses" },
  { icon: Calendar, label: "Schedule", path: "/teacher-dashboard/schedule" },
  { icon: MessageCircle, label: "Messages", path: "/teacher-dashboard/teachermessages" },
  { icon: Settings, label: "Settings", path: "/teacher-dashboard/settings" },
]

const TeacherSidebar = () => {
  const navigate = useNavigate()
  const { store, actions } = useContext(Context)

    useEffect(() => {
      actions.getPrivate("teache");
      },[])
    useEffect(() =>  {
  
      if(store.teache === false){
        navigate("/login")
      }else{
        console.log("parent is logged in",store.teache)
      }
    }, [store.teache])
  return (
    <nav className="tw-bg-white tw-w-64 tw-h-full tw-border-r tw-border-gray-200">
      <div className="tw-flex tw-items-center tw-justify-center tw-h-16 tw-border-b tw-border-gray-200">
        <span className="tw-text-xl tw-font-semibold tw-text-gray-800">Daycare</span>
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
  )
}

export default TeacherSidebar

