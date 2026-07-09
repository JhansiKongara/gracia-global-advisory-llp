import React, { useState } from 'react';
import {
  X, ChevronRight, Clock, User, Building2, CalendarDays,
  Banknote, ArrowRightLeft, BarChart3, Info, Activity,
  IndianRupee, TrendingUp, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../data/mockData';

function StatusPill({ status }) {
  return (
    <span className={`status-pill ${status?.toLowerCase()}`}>
      {status}
    </span>
  );
}

function InfoItem({ label, value, mono = false }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className={`info-value ${mono ? 'mono' : ''}`}>{value || '—'}</span>
    </div>
  );
}

function TrancheSection({ tranches }) {
  if (!tranches || tranches.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '30px 0' }}>
        <IndianRupee size={28} />
        <p>No tranches disbursed yet</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="tranche-table">
        <thead>
          <tr>
            <th>Tranche ID</th>
            <th>Date</th>
            <th>Tranche</th>
            <th>Disbursed Amt</th>
            <th>Verified Amt</th>
            <th>UTR Number</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tranches.map((t) => (
            <tr key={t.id}>
              <td className="table-id">{t.id}</td>
              <td>{formatDate(t.disbursementDate)}</td>
              <td><span style={{ fontWeight: 600, color: '#4F46E5' }}>{t.tranche}</span></td>
              <td className="table-amount">{formatCurrency(t.disbursementAmt)}</td>
              <td className="table-amount">{t.verifiedDisbAmt > 0 ? formatCurrency(t.verifiedDisbAmt) : <span style={{ color: '#94A3B8' }}>—</span>}</td>
              <td>
                {t.utrNumber
                  ? <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#2563EB' }}>{t.utrNumber}</span>
                  : <span style={{ color: '#94A3B8' }}>—</span>
                }
              </td>
              <td><StatusPill status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CommissionSection({ commission, brokerInfo }) {
  return (
    <div>
      <div className="commission-summary">
        <div className="commission-card">
          <div className="label">Commission Rate</div>
          <div className="value purple">{commission.rate}</div>
        </div>
        <div className="commission-card">
          <div className="label">Total Commission</div>
          <div className="value green">{formatCurrency(commission.total)}</div>
        </div>
        <div className="commission-card">
          <div className="label">Referral Fee</div>
          <div className="value">{formatCurrency(brokerInfo.totalReferralFee)}</div>
        </div>
      </div>

      {commission.breakdown.length > 0 && (
        <>
          <div className="section-title" style={{ marginBottom: 10 }}>Breakdown by Tranche</div>
          <table className="tranche-table">
            <thead>
              <tr>
                <th>Tranche</th>
                <th>Commission Amount</th>
              </tr>
            </thead>
            <tbody>
              {commission.breakdown.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{b.tranche}</td>
                  <td className="table-amount" style={{ color: '#16A34A', fontWeight: 700 }}>{formatCurrency(b.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="panel-section" style={{ padding: '16px 0 0', border: 'none' }}>
        <div className="section-title">Broker / Referral Info</div>
        <div className="info-grid">
          <InfoItem label="Broker Name" value={brokerInfo.brokerName} />
          <InfoItem label="Referral %" value={brokerInfo.referralPct} />
          <InfoItem label="Total Referral Fee" value={formatCurrency(brokerInfo.totalReferralFee)} />
        </div>
      </div>
    </div>
  );
}

function ActivitySection({ log }) {
  const iconMap = {
    'Loan Created': <CheckCircle size={14} />,
    'Status Updated': <ArrowRightLeft size={14} />,
    'Updated Disbursed Amount': <IndianRupee size={14} />,
    'Commission Calculated': <BarChart3 size={14} />,
  };

  return (
    <div className="timeline">
      {log.map((item) => (
        <div key={item.id} className="timeline-item">
          <div className="timeline-dot">
            {iconMap[item.action] || <Activity size={14} />}
          </div>
          <div className="timeline-content">
            <div className="timeline-action">{item.action}</div>
            <div className="timeline-meta">By {item.by} · {formatDateTime(item.date)}</div>
            <div className="timeline-detail">
              <div>{item.details}</div>
              {item.from && item.to && (
                <div className="change-row">
                  <span className="change-from">{item.from}</span>
                  <ChevronRight size={13} />
                  <span className="change-to">{item.to}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'tranches', label: 'Tranches', icon: ArrowRightLeft },
  { id: 'commission', label: 'Commission', icon: BarChart3 },
  { id: 'activity', label: 'Activity Log', icon: Activity },
];

function DisbursementDetailPanel({ disbursement, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!disbursement) return null;

  const { applicantInfo, loanDetails, commission, brokerInfo, tranches, activityLog, additionalInfo } = disbursement;

  return (
    <>
      <div className={`panel-overlay ${disbursement ? 'open' : ''}`} onClick={onClose} />
      <aside className={`detail-panel ${disbursement ? 'open' : ''}`}>
        <div className="panel-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="table-id" style={{ fontSize: 14 }}>{disbursement.id}</span>
              <StatusPill status={disbursement.status} />
            </div>
            <div className="panel-header-title">{disbursement.applicantName}</div>
            <div className="panel-header-sub">
              {loanDetails.loanType} · {disbursement.bankName} · {formatDate(disbursement.disbursementDate)}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Summary stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
        }}>
          {[
            { label: 'Sanctioned', value: formatCurrency(disbursement.sanctionedAmt) },
            { label: 'Disbursed', value: formatCurrency(disbursement.totalDisbursementAmt) },
            { label: 'Commission', value: formatCurrency(disbursement.commissionIncome) },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              borderRight: i < 2 ? '1px solid var(--color-border)' : 'none',
            }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 3, letterSpacing: '-0.3px' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="panel-tabs">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              className={`panel-tab ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="panel-body">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <div className="panel-section">
                <div className="section-title">Applicant Information</div>
                <div className="info-grid">
                  <InfoItem label="Full Name" value={applicantInfo.name} />
                  <InfoItem label="PAN" value={applicantInfo.pan} mono />
                  <InfoItem label="Date of Birth" value={formatDate(applicantInfo.dob)} />
                  <InfoItem label="Phone" value={applicantInfo.phone} />
                  <InfoItem label="Email" value={applicantInfo.email} />
                </div>
                <div className="info-item" style={{ marginTop: 14 }}>
                  <span className="info-label">Address</span>
                  <span className="info-value">{applicantInfo.address}</span>
                </div>
              </div>

              <div className="panel-section">
                <div className="section-title">Loan Details</div>
                <div className="info-grid">
                  <InfoItem label="Loan ID" value={loanDetails.loanId} mono />
                  <InfoItem label="Loan Type" value={loanDetails.loanType} />
                  <InfoItem label="Sanction Date" value={formatDate(loanDetails.sanctionDate)} />
                  <InfoItem label="Sanctioned Amt" value={formatCurrency(loanDetails.sanctionedAmt)} />
                  <InfoItem label="Verified Sanction" value={formatCurrency(loanDetails.verifiedSanctionedAmt)} />
                  <InfoItem label="Tenure" value={loanDetails.tenure} />
                  <InfoItem label="Interest Rate" value={loanDetails.interestRate} />
                  <InfoItem label="Credit Executive" value={loanDetails.creditExecutive} />
                  <InfoItem label="Bank" value={disbursement.bankName} />
                  <InfoItem label="Coordinator Bank" value={disbursement.coordinatorBank} />
                </div>
                {loanDetails.coApplicants?.length > 0 && (
                  <div className="info-item" style={{ marginTop: 14 }}>
                    <span className="info-label">Co-Applicants</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      {loanDetails.coApplicants.map((c, i) => (
                        <span key={i} style={{
                          background: 'var(--color-brand-light)',
                          color: 'var(--color-brand)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 12,
                          fontWeight: 600,
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {additionalInfo && (
                <div className="panel-section">
                  <div className="section-title">Additional Notes</div>
                  <div style={{
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}>{additionalInfo}</div>
                </div>
              )}
            </>
          )}

          {/* TRANCHES */}
          {activeTab === 'tranches' && (
            <div className="panel-section">
              <div className="section-title">Tranche Disbursements ({tranches.length})</div>
              <TrancheSection tranches={tranches} />
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 12, marginTop: 16,
              }}>
                <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Sanctioned</div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{formatCurrency(disbursement.totalSanctionedAmt)}</div>
                </div>
                <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600, textTransform: 'uppercase' }}>Total Disbursed</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>{formatCurrency(disbursement.totalDisbursementAmt)}</div>
                </div>
              </div>
            </div>
          )}

          {/* COMMISSION */}
          {activeTab === 'commission' && (
            <div className="panel-section">
              <div className="section-title">Commission & Referral</div>
              <CommissionSection commission={commission} brokerInfo={brokerInfo} />
            </div>
          )}

          {/* ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="panel-section">
              <div className="section-title">Activity Log</div>
              <ActivitySection log={activityLog} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default DisbursementDetailPanel;
