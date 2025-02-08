import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Resumen' },
    { id: 'clients', label: 'Clientes' },
    { id: 'classes', label: 'Clases y Servicios' },
    { id: 'enrollments', label: 'Inscripciones' },
  ];

  const overviewCards = [
    { title: 'Total de Clientes', value: '1,', link: '/admin-dashboard/clients', linkText: 'Gestionar Clientes' },
    { title: 'Clases Activas', value: '25', link: '/admin-dashboard/classes', linkText: 'Ver Clases' },
    { title: 'Nuevas Inscripciones', value: '15', link: '/admin-dashboard/enrollments', linkText: 'Ver Inscripciones' },
    { title: 'Ingresos Mensuales', value: '$45,231', link: '/admin-dashboard/reports', linkText: 'Ver Informes' },
  ];

  return (
    <div>
      <div className="tw-inline-flex tw-h-10 tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-p-1 tw-text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-sm tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 ${
              activeTab === tab.id ? 'tw-bg-background tw-text-foreground tw-shadow-sm' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="tw-mt-4 tw-grid tw-gap-4 tw-md:grid-cols-2 tw-lg:grid-cols-4">
          {overviewCards.map((card, index) => (
            <div key={index} className="tw-rounded-lg tw-border tw-bg-card tw-text-card-foreground tw-shadow-sm">
              <div className="tw-p-6">
                <h3 className="tw-tracking-tight tw-text-sm tw-font-medium">{card.title}</h3>
                <div className="tw-mt-2 tw-text-2xl tw-font-bold">{card.value}</div>
                <Link
                  to={card.link}
                  className="tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 tw-disabled:tw-pointer-events-none tw-disabled:tw-opacity-50 [&_svg]:tw-pointer-events-none [&_svg]:tw-size-4 [&_svg]:tw-shrink-0 tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90 tw-h-10 tw-px-4 tw-py-2 tw-mt-2"
                >
                  {card.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default DashboardContent;

