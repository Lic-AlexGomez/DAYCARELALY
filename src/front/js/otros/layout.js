

import { useContext } from "react"
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom"
import ScrollToTop from "./component/scrollToTop"
import { BackendURL } from "./component/backendURL"
import { Context } from "./store/appContext"

import { Home } from "./pages/home"
import { Single } from "./pages/single"
import injectContext from "./store/appContext"

import { Navbar } from "./component/navbar"
import Footer from "./component/footer"
import Login from "./pages/login.jsx"

import ContactUs from "./pages/ContactUs.jsx"
import Events from "./pages/Events.jsx"
import Programs from "./pages/Programs.jsx"
import MoreInfo from "./pages/MoreInfo.jsx"
import ConfirmAttendance from "./pages/ConfirmAttendance.jsx"
import Allprograms from "./pages/Allprograms.jsx"
import PreviousEventsPhotos from "./pages/PreviousEventsPhotos.jsx"
import Gallery from "./pages/Gallery.jsx"
import Services from "./pages/Services.jsx"
import AboutUs from "./pages/About_us.jsx"

// Componentes del Admin Dashboard
import Sidebar from "./component/admin/Sidebar"
import Header from "./component/admin/Header"
import DashboardOverview from "./component/admin/DashboardOverview"
import ClientsView from "./component/admin/ClientsView"
import ScheduleManagement from "./component/admin/ScheduleManagement"
import ClassesView from "./component/admin/ClassesView"
import EnrollmentsView from "./component/admin/EnrollmentsView"
import ReportsView from "./component/admin/ReportsView"
import BlogView from "./component/admin/BlogView"
import InventoryView from "./component/admin/InventoryView"
import EmailsView from "./component/admin/EmailsView"
import NotificationsView from "./component/admin/NotificationsView"
import ArchiveView from "./component/admin/ArchiveView"
import ScheduleView from "./component/admin/ScheduleView"
import TasksView from "./component/admin/TasksView"
import ActivitiesView from "./component/admin/ActivitiesView"
import VideosView from "./component/admin/VideosView"
import InactiveAccountsView from "./component/admin/InactiveAccountsView"
import ApprovalsView from "./component/admin/ApprovalsView"
import MaintenanceView from "./component/admin/MaintenanceView"
import SettingsView from "./component/admin/SettingsView"
import DashboardContent from "./component/admin/DahboardContent.jsx"
import { SignupCommon } from "./pages/SignupCommon.jsx"
import { StaffSignup } from "./component/admin/StaffSignup.jsx"
import ProfileView from "./component/admin/ProfileView.jsx"
import EventsView from "./component/admin/EventsView.jsx"
import ServicesView from "./component/admin/Services.jsx"
import GalleryView from "./component/admin/Gallery.jsx"
import ForgotPassword from "./component/ForgotPassword.jsx"
import TeacherOverview from "./component/teacher/TeacherOverview"
import TeacherClasses from "./component/teacher/TeacherClasses"
import TeacherStudents from "./component/teacher/TeacherStudents"
import TeacherAssignments from "./component/teacher/TeacherAssignments"
import TeacherSchedule from "./component/teacher/TeacherSchedule"
import TeacherSettings from "./component/teacher/TeacherSettings"
import TeacherSidebar from "./component/teacher/TeacherSidebar.jsx"
import TeacherHeader from "./component/teacher/TeacherHeader.jsx"
import TeacherProfile from "./component/teacher/TeacherProfile.jsx"

// Componentes del Parent Dashboard
import ParentOverview from "./component/parent/ParentOverview"
import ParentChildren from "./component/parent/ParentChildren"
import ParentSchedule from "./component/parent/ParentSchedule"
import ParentActivities from "./component/parent/ParentActivities"
import ParentPayments from "./component/parent/ParentPayments"
import ParentSettings from "./component/parent/ParentSettings"
import ParentSidebar from "./component/parent/ParentSidebar.jsx"
import ParentHeader from "./component/parent/ParentHeader.jsx"
import ParentVirtualClasses from "./component/parent/ParentVirtualClasses.jsx"
import ParentMessages from "./component/parent/parentMessages.jsx"
import ClassEnrroll from "./component/parent/ParentVirtualClassesEnroll.jsx"

const AdminDashboard = () => (

  <div className="tw-flex tw-h-screen tw-overflow-hidden">
    <Sidebar />
    <div className="tw-flex-1 tw-overflow-auto">
      <Header />
      <main className="tw-p-6 tw-mt-2">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/events" element={<EventsView />} />
          <Route path="/schedule-management" element={<ScheduleManagement />} />
          <Route path="/classes" element={<ClassesView />} />
          <Route path="/enrollments" element={<EnrollmentsView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/blog" element={<BlogView />} />
          <Route path="/inventory" element={<InventoryView />} />
          <Route path="/emails" element={<EmailsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/archive" element={<ArchiveView />} />
          <Route path="/schedule" element={<ScheduleView />} />
          <Route path="/tasks" element={<TasksView />} />
          <Route path="/activities" element={<ActivitiesView />} />
          <Route path="/services" element={<ServicesView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/videos" element={<VideosView />} />
          <Route path="/inactive-accounts" element={<InactiveAccountsView />} />
          <Route path="/approvals" element={<ApprovalsView />} />
          <Route path="/maintenance" element={<MaintenanceView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/staff-signup" element={<StaffSignup />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/dashboard-content" element={<DashboardContent />} />
          <Route path="*" element={<h1>Not found!</h1>} />
        </Routes>
      </main>
    </div>
  </div>
)

const TeacherDashboardRoutes = () => (
  <div className="tw-flex tw-h-screen tw-overflow-hidden">
    <TeacherSidebar />
    <div className="tw-flex-1 tw-overflow-auto">
      <TeacherHeader />
      <main className="tw-p-6 tw-mt-2">
        <Routes>
          <Route path="/" element={<TeacherOverview />} />
          <Route path="/classes" element={<TeacherClasses />} />
          <Route path="/students" element={<TeacherStudents />} />
          <Route path="/assignments" element={<TeacherAssignments />} />
          <Route path="/schedule" element={<TeacherSchedule />} />
          <Route path="/settings" element={<TeacherSettings />} />
          <Route path="/profile" element={<TeacherProfile />} />
          <Route path="*" element={<TeacherOverview />} />
        </Routes>
      </main>
    </div>
  </div>
)

const ParentDashboardRoutes = () => (
  <div className="tw-flex tw-h-screen tw-overflow-hidden">
    <ParentSidebar />
    <div className="tw-flex-1 tw-overflow-auto">
      <ParentHeader />
      <main className="tw-p-6 tw-mt-2">
        <Routes>
          <Route path="/" element={<ParentOverview />} />
          <Route path="/children" element={<ParentChildren />} />
          <Route path="/schedule" element={<ParentSchedule />} />
          <Route path="/activities" element={<ParentActivities />} />
          <Route path="/payments" element={<ParentPayments />} />
          <Route path="/virtual-classes" element={<ParentVirtualClasses />} />
          <Route path="/settings" element={<ParentSettings />} />
          <Route path="/messages" element={<ParentMessages />} />
          <Route path="/virtual-classes-enroll" element={<ClassEnrroll />} />
          <Route path="*" element={<ParentOverview />} />
        </Routes>
      </main>
    </div>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { store } = useContext(Context)
  const location = useLocation()

  if (!store.token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

const MainRoutes = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin-dashboard")
  const isTeacherRoute = location.pathname.startsWith("/teacher-dashboard")
  const isParentRoute = location.pathname.startsWith("/parent-dashboard")

  return (
    <>
      {!isAdminRoute && !isTeacherRoute && !isParentRoute && <Navbar />}
      <Routes>
        {/* Rutas principales */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/single/:theid" element={<Single />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupCommon />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/moreinfo" element={<MoreInfo />} />
        <Route path="/services" element={<Services />} />
        <Route path="/eventphotos" element={<PreviousEventsPhotos />} />
        <Route path="/confirmattendance" element={<ConfirmAttendance />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/teacher-dashboard/*"
          element={
            <ProtectedRoute>
              <TeacherDashboardRoutes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent-dashboard/*"
          element={
            <ProtectedRoute>
              <ParentDashboardRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="/programs" element={<Programs />} />
        <Route path="/allprograms" element={<Allprograms />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdminRoute && !isTeacherRoute && !isParentRoute && <Footer />}
    </>
  )
}

const Layout = () => {
  const basename = process.env.BASENAME || ""

  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <MainRoutes />
    </BrowserRouter>
  )
}

export default injectContext(Layout)

