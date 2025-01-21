import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ParentHeader from "./ParentHeader"
import ParentSidebar from "./ParentSidebar"
import ParentOverview from "./ParentOverview"
import ParentChildren from "./ParentChildren"
import ParentSchedule from "./ParentSchedule"
import ParentActivities from "./ParentActivities"
import ParentPayments from "./ParentPayments"
import ParentSettings from "./ParentSettings"

const ParentDashboard = () => {
  return (
    <Router>
      <div className="tw-flex tw-h-screen tw-overflow-hidden tw-bg-gray-100">
        <ParentSidebar />
        <div className="tw-flex tw-flex-col tw-flex-1 tw-overflow-hidden">
          <ParentHeader />
          <main className="tw-flex-1 tw-overflow-x-hidden tw-overflow-y-auto tw-bg-gray-100">
            <div className="tw-container tw-mx-auto tw-px-6 tw-py-8">
              <Switch>
                <Route exact path="/parent-dashboard" component={ParentOverview} />
                <Route path="/parent-dashboard/children" component={ParentChildren} />
                <Route path="/parent-dashboard/schedule" component={ParentSchedule} />
                <Route path="/parent-dashboard/activities" component={ParentActivities} />
                <Route path="/parent-dashboard/payments" component={ParentPayments} />
                <Route path="/parent-dashboard/settings" component={ParentSettings} />
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default ParentDashboard

