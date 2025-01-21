import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import TeacherHeader from "./TeacherHeader"
import TeacherSidebar from "./TeacherSidebar"
import TeacherOverview from "./TeacherOverview"
import TeacherClasses from "./TeacherClasses"
import TeacherStudents from "./TeacherStudents"
import TeacherAssignments from "./TeacherAssignments"
import TeacherSchedule from "./TeacherSchedule"
import TeacherSettings from "./TeacherSettings"

const TeacherDashboard = () => {
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

