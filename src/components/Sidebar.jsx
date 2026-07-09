import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  Settings,
  ChevronRight,
  TrendingUp,
  PieChart,
  Bell,
  HelpCircle,
  LogOut,
  UserPlus,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'disbursements', label: 'Disbursements', icon: CreditCard, badge: '5' },
  { id: 'onboarding',    label: 'Customer Onboarding', icon: UserPlus },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reports', label: 'Reports', icon: TrendingUp },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
];

const BOTTOM_ITEMS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ activePage, onNav }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">F</div>
        <span className="sidebar-logo-text">FinBowl</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            className={`sidebar-item ${activePage === id ? 'active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {badge && <span className="badge">{badge}</span>}
          </button>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: 12 }}>Account</div>
        {BOTTOM_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-item ${activePage === id ? 'active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}

        <button className="sidebar-item" style={{ marginTop: 'auto', color: '#EF4444' }}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </nav>

      {/* User profile at bottom */}
      <div style={{
        padding: '14px 14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0,
        }}>J</div>
        <div className="sidebar-logo-text" style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Jayati</div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>Admin</div>
        </div>
        <ChevronRight size={15} color="#475569" className="sidebar-logo-text" />
      </div>
    </aside>
  );
}

export default Sidebar;
