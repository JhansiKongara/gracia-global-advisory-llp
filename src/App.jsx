import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DisbursementsPage from './pages/DisbursementsPage';
import CustomerOnboarding from './pages/CustomerOnboarding';
import { Bell, Search } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  disbursements: 'Disbursements',
  onboarding: 'Customer Onboarding',
  customers: 'Customers',
  reports: 'Reports',
  documents: 'Documents',
  analytics: 'Analytics',
  notifications: 'Notifications',
  help: 'Help & Support',
  settings: 'Settings',
};

function PlaceholderPage({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: 48 }}>🚧</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{title}</h2>
      <p style={{ fontSize: 13 }}>This section is coming soon.</p>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('disbursements');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNav={setActivePage} />;
      case 'disbursements': return <DisbursementsPage />;
      case 'onboarding': return <CustomerOnboarding />;
      default: return <PlaceholderPage title={PAGE_TITLES[activePage] || activePage} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNav={setActivePage} />

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <span>FinBowl</span>
            <span style={{ color: 'var(--color-border)' }}>/</span>
            <span className="crumb-active">{PAGE_TITLES[activePage] || activePage}</span>
          </div>
          <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
            <button className="btn btn-ghost btn-icon" title="Notifications">
              <Bell size={17} />
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>J</div>
          </div>
        </header>

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
