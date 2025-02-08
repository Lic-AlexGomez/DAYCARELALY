import React, { useState,useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Users, BookOpen, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Actions } from '@cloudinary/url-gen/index';


const DashboardOverview = () => {
  const { store, actions } = useContext(Context)
  const [activeTab, setActiveTab] = useState('overview');

useEffect(()=>{
  actions.GetClients()
},[])

const tabs = [
  { id: 'overview', label: 'Summary' },
];

const stats = [
  { title: 'Total Clients', value:store.clients.length, icon: Users, color: 'tw-bg-blue-500' , link: '/admin-dashboard/clients', linkText: 'Manage Clients' },
  { title: 'Total Active Classes', value:store.classes.length, icon: BookOpen, color: 'tw-bg-green-500' , link: '/admin-dashboard/classes', linkText: 'See Classes' },
  { title: 'New Registrations', value:store.subscriptions.length, icon: FileText, color: 'tw-bg-yellow-500', link: '/admin-dashboard/enrollments', linkText: 'See Registrations' },
  { title: 'Total programs ', value: store.activities.length, icon: DollarSign, color: 'tw-bg-purple-500', link: '/admin-dashboard/activities', linkText: 'See programs' },
  { title: 'Active Services', value: store.services.length, icon: TrendingUp, color: 'tw-bg-red-500' , link: '/admin-dashboard/services', linkText: 'See Services' },
  { title: 'Upcoming Events', value: store.events.length, icon: Calendar, color: 'tw-bg-indigo-500', link: '/admin-dashboard/events', linkText: 'Ver eventos' },
];


const OverviewTab = () =>
  
(<>
   
   <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8 tw-my-6 tw-justify-items-center">
  {stats.map((stat, index) => (
    <div key={index} className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6 tw-mr-12 last:tw-mr-0">
      <div className="tw-flex tw-items-center">
        <div className={`tw-rounded-full tw-p-3 ${stat.color}`}>
          <stat.icon className="tw-w-6 tw-h-6 tw-text-white" />
        </div>
        <div className="tw-ml-4">
          <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700">{stat.title}</h3>
          <p className="tw-text-2xl tw-font-bold tw-text-gray-900">{stat.value}</p>
        </div>
      </div>

      <div className="tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-justify-center tw-my-5 tw-rounded tw-bg-gray-100 tw-text-center tw-py-2 hover:tw-text-black hover:tw-bg-cyan-500">
        <Link to={stat.link}>
          {stat.linkText}
        </Link>
      </div>
    </div>
  ))}
</div>

  
  </>
);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'clients':
        return <ClientsTab />;
      case 'classes':
        return <ClassesTab />;
      case 'enrollments':
        return <EnrollmentsTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-6">Control Panel</h2>

      <div className="tw-inline-flex tw-my-10 tw-h-10 tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-p-1 tw-text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-sm tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 ${
              activeTab === tab.id ? 'tw-bg-cyan-500 tw-text-neutral-50 tw-shadow-sm' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}

     
    </div>
  );
};

export default DashboardOverview;
