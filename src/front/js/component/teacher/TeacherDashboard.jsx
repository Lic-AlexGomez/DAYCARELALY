import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.token) {
      navigate("/login", { replace: true });
    }
  }, [store.token, navigate]);
  return (
    <Router>
      <div className="tw-flex tw-h-screen tw-overflow-hidden tw-bg-gray-100">
        <TeacherSidebar />
        <div className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden">
          <TeacherHeader />
          <main className="tw-flex-1 tw-overflow-x-hidden tw-overflow-y-auto tw-bg-gray-100">
            <div className="tw-container tw-mx-auto tw-px-6 tw-py-3">
                <h1>d</h1>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default TeacherDashboard

