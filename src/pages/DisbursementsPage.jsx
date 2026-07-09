import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Filter, Plus, Download, RefreshCw,
  ChevronLeft, ChevronRight, SlidersHorizontal,
  ArrowUpDown, TrendingUp, CreditCard, CheckCircle,
  Loader2, AlertCircle
} from 'lucide-react';
import { disbursements, summaryStats, formatCurrency, formatDate } from '../data/mockData';
import DisbursementDetailPanel from '../components/DisbursementDetailPanel';

const STATUSES = ['All', 'Submitted', 'Verified', 'Processed', 'Audited'];
const PAGE_SIZE = 8;

function StatusPill({ status }) {
  return <span className={`status-pill ${status?.toLowerCase()}`}>{status}</span>;
}

function StatCard({ label, value, sub, icon: Icon, color = 'var(--color-brand)' }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-label">{label}</span>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          <Icon size={17} />
        </div>
      </div>
      <div className={`stat-value ${typeof value === 'string' && value.includes('₹') ? 'currency' : ''}`}>{value}</div>
      {sub && <div className="stat-badge neutral">{sub}</div>}
    </div>
  );
}

/* ── Loading skeleton row ── */
function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: 9 }).map((_, j) => (
        <td key={j} style={{ padding: '14px 16px' }}>
          <div className="skeleton" style={{ height: 14, borderRadius: 4, width: j === 0 ? 90 : j === 1 ? 80 : j === 8 ? 60 : 100 }} />
        </td>
      ))}
    </tr>
  ));
}

/* ── Error state ── */
function ErrorState({ onRetry }) {
  return (
    <tr>
      <td colSpan={9}>
        <div className="empty-state">
          <AlertCircle size={36} color="var(--color-error)" style={{ opacity: 1 }} />
          <h3>Failed to load disbursements</h3>
          <p>Something went wrong while fetching the data.</p>
          <button className="btn btn-primary btn-sm" onClick={onRetry} style={{ marginTop: 8 }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </td>
    </tr>
  );
}

function DisbursementsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bankFilter, setBankFilter] = useState('All');
  const [sortKey, setSortKey] = useState('disbursementDate');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);

  // Simulate data fetch states
  const [dataState] = useState('loaded'); // 'loading' | 'error' | 'loaded'

  const allBanks = useMemo(() => {
    const banks = [...new Set(disbursements.map((d) => d.bankName))];
    return ['All', ...banks];
  }, []);

  const filtered = useMemo(() => {
    let data = [...disbursements];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          d.applicantName.toLowerCase().includes(q) ||
          d.bankName.toLowerCase().includes(q) ||
          d.loanId.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All') data = data.filter((d) => d.status === statusFilter);
    if (bankFilter !== 'All') data = data.filter((d) => d.bankName === bankFilter);

    data.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [search, statusFilter, bankFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = useCallback((key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }, [sortKey]);

  const SortableHeader = ({ label, sortId }) => (
    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort(sortId)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}
        <ArrowUpDown size={11} style={{ opacity: sortKey === sortId ? 1 : 0.3, color: sortKey === sortId ? 'var(--color-brand)' : 'inherit' }} />
      </div>
    </th>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>Disbursements</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
            Track and manage all loan disbursements
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-sm">
            <Plus size={14} /> Add Disbursement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard label="Total Disbursed" value={formatCurrency(summaryStats.totalDisbursed)} icon={CreditCard} color="#4F46E5" />
        <StatCard label="Submitted" value={summaryStats.submitted} sub="Awaiting review" icon={TrendingUp} color="#D97706" />
        <StatCard label="Verified" value={summaryStats.verified} icon={CheckCircle} color="#16A34A" />
        <StatCard label="Processed" value={summaryStats.processed} icon={Loader2} color="#2563EB" />
        <StatCard label="Audited" value={summaryStats.audited} icon={CheckCircle} color="#7C3AED" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={15} color="var(--color-text-muted)" />
            <input
              placeholder="Search by ID, name, bank..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Filter size={14} color="var(--color-text-muted)" />
            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select
              className="select-input"
              value={bankFilter}
              onChange={(e) => { setBankFilter(e.target.value); setPage(1); }}
            >
              {allBanks.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-text-muted)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader label="Disbursement ID" sortId="id" />
              <SortableHeader label="Date" sortId="disbursementDate" />
              <th>Applicant</th>
              <th>Bank</th>
              <SortableHeader label="Sanctioned Amt" sortId="sanctionedAmt" />
              <SortableHeader label="Verified Amt" sortId="verifiedAmt" />
              <th>Ref. %</th>
              <th>Credit Executive</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataState === 'loading' && <SkeletonRows />}
            {dataState === 'error' && <ErrorState onRetry={() => {}} />}
            {dataState === 'loaded' && paged.length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <Search size={32} />
                    <h3>No results found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
            {dataState === 'loaded' && paged.map((d) => (
              <tr key={d.id} onClick={() => setSelectedDisbursement(d)}>
                <td className="table-id">{d.id}</td>
                <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{formatDate(d.disbursementDate)}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{d.applicantName}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 1 }}>{d.loanId}</div>
                </td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{d.bankName}</td>
                <td className="table-amount">{formatCurrency(d.sanctionedAmt)}</td>
                <td className="table-amount">{formatCurrency(d.verifiedAmt)}</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{d.referralPct}%</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0,
                    }}>
                      {d.creditExecutive.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 13 }}>{d.creditExecutive}</span>
                  </div>
                </td>
                <td><StatusPill status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {dataState === 'loaded' && totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <DisbursementDetailPanel
        disbursement={selectedDisbursement}
        onClose={() => setSelectedDisbursement(null)}
      />
    </div>
  );
}

export default DisbursementsPage;
