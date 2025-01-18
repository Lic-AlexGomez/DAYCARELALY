import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Login from "./pages/login.jsx";
import { Signup } from "./pages/signup.jsx";
import ContactUs from "./pages/ContactUs.jsx";

// Componentes del Admin Dashboard
import Sidebar from "./component/admin/Sidebar";
import Header from "./component/admin/Header";
import DashboardOverview from "./component/admin/DashboardOverview";


const LayoutContent = () => {
    const location = useLocation(); 
    const adminRoutes = location.pathname.startsWith("/admin-dashboard");

    return (
        <ScrollToTop>
            <Routes>
              
                <Route
                    path="/*"
                    element={
                        <>
                            {!adminRoutes && <Navbar />}
                            <Routes>
                                <Route element={<Home />} path="/" />
                                <Route element={<Home />} path="/home" />
                                <Route element={<Demo />} path="/demo" />
                                <Route element={<Single />} path="/single/:theid" />
                                <Route element={<Login />} path="/login" />
                                <Route element={<Signup />} path="/signup" />
                                <Route element={<ContactUs />} path="/contactus" />
                                <Route element={<h1>Not found!</h1>} path="*" />
                            </Routes>
                            {!adminRoutes && <Footer />}
                        </>
                    }
                />

              
                <Route
                    path="/admin-dashboard/*"
                    element={
                        <div className="tw-flex tw-h-screen tw-overflow-hidden">
                            <Sidebar />
                            <div className="tw-flex-1 tw-overflow-auto">
                                <Header />
                                <main className="tw-p-6">
                                    <Routes>
                                        <Route
                                            exact
                                            path="/admin-dashboard"
                                            element={<DashboardOverview />}
                                        />
                                       
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </ScrollToTop>
    );
};

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <LayoutContent />
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
