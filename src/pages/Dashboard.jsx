import React from 'react';
import {
  TrendingUp, CreditCard, Users, FileText,
  ArrowRight, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { disbursements, summaryStats, formatCurrency, formatDate } from '../data/mockData';

function StatusPill({ status }) {
  return <span className={`status-pill ${status?.toLowerCase()}`}>{status}</span>;
}

const RECENT = disbursements.slice(0, 4);

function Dashboard({ onNav }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>Good morning, Jayati 👋</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
          Here's what's happening with your disbursements today.
        </p>
      </div>

      {/* KPI row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Disbursed', value: formatCurrency(summaryStats.totalDisbursed), icon: CreditCard, color: '#4F46E5' },
          { label: 'Submitted', value: summaryStats.submitted, icon: Clock, color: '#D97706' },
          { label: 'Verified', value: summaryStats.verified, icon: CheckCircle, color: '#16A34A' },
          { label: 'Audited', value: summaryStats.audited, icon: AlertCircle, color: '#7C3AED' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">{s.label}</span>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <s.icon size={17} />
              </div>
            </div>
            <div className={`stat-value ${typeof s.value === 'string' && s.value.includes('₹') ? 'currency' : ''}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent disbursements */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 }}>
          <div>
            <div className="card-title">Recent Disbursements</div>
            <div className="card-subtitle">Last 4 transactions</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNav('disbursements')}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="table-container" style={{ border: 'none', borderTop: '1px solid var(--color-border)', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Applicant</th>
                <th>Bank</th>
                <th>Sanctioned</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map((d) => (
                <tr key={d.id} onClick={() => onNav('disbursements')}>
                  <td className="table-id">{d.id}</td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{formatDate(d.disbursementDate)}</td>
                  <td style={{ fontWeight: 600 }}>{d.applicantName}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{d.bankName}</td>
                  <td className="table-amount">{formatCurrency(d.sanctionedAmt)}</td>
                  <td><StatusPill status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
