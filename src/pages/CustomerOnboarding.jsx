import React, { useState } from 'react';
import {
  User, Phone, Banknote, FileText, CheckCircle,
  ChevronRight, ChevronLeft, Upload, AlertCircle
} from 'lucide-react';

/* ── Tab config ── */
const TABS = [
  { id: 'customer',  label: 'Customer Details',     icon: User },
  { id: 'contact',   label: 'Contact Information',   icon: Phone },
  { id: 'financial', label: 'Financial Details',     icon: Banknote },
  { id: 'documents', label: 'Documents',             icon: FileText },
  { id: 'review',    label: 'Review & Submit',       icon: CheckCircle },
];

/* ── Initial form state ── */
const INIT = {
  // Customer Details
  firstName: '', lastName: '', dob: '', gender: '', pan: '', aadhaar: '',
  // Contact
  phone: '', altPhone: '', email: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  // Financial
  employmentType: '', annualIncome: '', companyName: '',
  bankName: '', accountNumber: '', ifsc: '',
  loanType: '', loanAmount: '', existingLoans: '',
  // Documents
  panCard: null, aadhaarCard: null, incomeProof: null,
  addressProof: null, bankStatement: null, photo: null,
};

/* ── Field component ── */
function Field({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ fontSize: 11.5, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} />{error}
        </span>
      )}
    </div>
  );
}

const inputStyle = {
  height: 40, padding: '0 12px', border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)', fontSize: 13.5, fontFamily: 'inherit',
  color: 'var(--color-text-primary)', background: 'var(--color-surface)',
  outline: 'none', width: '100%', transition: 'border-color 0.15s',
};

function Input({ value, onChange, placeholder, type = 'text', style }) {
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ ...inputStyle, ...style }}
      onFocus={e => e.target.style.borderColor = 'var(--color-brand)'}
      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value} onChange={onChange}
      style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function FileUpload({ label, value, onChange }) {
  return (
    <div
      onClick={() => document.getElementById(`file-${label}`).click()}
      style={{
        border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
        padding: '18px 14px', cursor: 'pointer', textAlign: 'center',
        background: value ? 'var(--color-success-bg)' : 'var(--color-surface-2)',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-brand)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      <input
        id={`file-${label}`} type="file" style={{ display: 'none' }}
        onChange={e => onChange(e.target.files[0])}
      />
      {value ? (
        <div style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 13 }}>
          <CheckCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
          {value.name}
        </div>
      ) : (
        <>
          <Upload size={20} color="var(--color-text-muted)" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
            Click to upload <strong>{label}</strong>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>PDF, JPG, PNG</div>
        </>
      )}
    </div>
  );
}

/* ── Section heading ── */
function SectionHead({ title }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px',
      color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)',
      paddingBottom: 8, marginBottom: 4,
    }}>{title}</div>
  );
}

/* ── Grid wrapper ── */
function Grid({ cols = 2, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px 20px' }}>
      {children}
    </div>
  );
}

/* ── Form tabs ── */
function TabCustomer({ d, set, errors }) {
  const f = key => e => set(p => ({ ...p, [key]: e.target.value }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Personal Information" />
      <Grid>
        <Field label="First Name" required error={errors.firstName}>
          <Input value={d.firstName} onChange={f('firstName')} placeholder="Rahul" />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <Input value={d.lastName} onChange={f('lastName')} placeholder="Verma" />
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <Input type="date" value={d.dob} onChange={f('dob')} />
        </Field>
        <Field label="Gender" required>
          <Select value={d.gender} onChange={f('gender')} placeholder="Select Gender"
            options={['Male', 'Female', 'Other', 'Prefer not to say']} />
        </Field>
      </Grid>
      <SectionHead title="Identity" />
      <Grid>
        <Field label="PAN Number" required error={errors.pan}>
          <Input value={d.pan} onChange={f('pan')} placeholder="ABCDE1234F"
            style={{ textTransform: 'uppercase', letterSpacing: '1px' }} />
        </Field>
        <Field label="Aadhaar Number" required error={errors.aadhaar}>
          <Input value={d.aadhaar} onChange={f('aadhaar')} placeholder="XXXX XXXX XXXX" />
        </Field>
      </Grid>
    </div>
  );
}

function TabContact({ d, set, errors }) {
  const f = key => e => set(p => ({ ...p, [key]: e.target.value }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Phone & Email" />
      <Grid>
        <Field label="Primary Phone" required error={errors.phone}>
          <Input value={d.phone} onChange={f('phone')} placeholder="+91 98765 43210" type="tel" />
        </Field>
        <Field label="Alternate Phone">
          <Input value={d.altPhone} onChange={f('altPhone')} placeholder="+91 87654 32109" type="tel" />
        </Field>
        <Field label="Email Address" required error={errors.email} >
          <Input value={d.email} onChange={f('email')} placeholder="rahul@email.com" type="email" />
        </Field>
      </Grid>
      <SectionHead title="Address" />
      <Grid cols={1}>
        <Field label="Address Line 1" required error={errors.addressLine1}>
          <Input value={d.addressLine1} onChange={f('addressLine1')} placeholder="Flat / House No, Street" />
        </Field>
        <Field label="Address Line 2">
          <Input value={d.addressLine2} onChange={f('addressLine2')} placeholder="Landmark, Area" />
        </Field>
      </Grid>
      <Grid>
        <Field label="City" required error={errors.city}>
          <Input value={d.city} onChange={f('city')} placeholder="Hyderabad" />
        </Field>
        <Field label="State" required>
          <Select value={d.state} onChange={f('state')} placeholder="Select State"
            options={['Andhra Pradesh','Telangana','Karnataka','Maharashtra','Tamil Nadu','Gujarat','Delhi','Other']} />
        </Field>
        <Field label="Pincode" required error={errors.pincode}>
          <Input value={d.pincode} onChange={f('pincode')} placeholder="500001" />
        </Field>
      </Grid>
    </div>
  );
}

function TabFinancial({ d, set }) {
  const f = key => e => set(p => ({ ...p, [key]: e.target.value }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Employment & Income" />
      <Grid>
        <Field label="Employment Type" required>
          <Select value={d.employmentType} onChange={f('employmentType')} placeholder="Select Type"
            options={['Salaried','Self Employed','Business Owner','Retired','Other']} />
        </Field>
        <Field label="Annual Income (₹)" required>
          <Input value={d.annualIncome} onChange={f('annualIncome')} placeholder="12,00,000" type="number" />
        </Field>
        <Field label="Company / Employer Name">
          <Input value={d.companyName} onChange={f('companyName')} placeholder="ABC Pvt. Ltd." />
        </Field>
      </Grid>
      <SectionHead title="Bank Account" />
      <Grid>
        <Field label="Bank Name" required>
          <Select value={d.bankName} onChange={f('bankName')} placeholder="Select Bank"
            options={['HDFC Bank','ICICI Bank','SBI','Axis Bank','Kotak Bank','Yes Bank','PNB','Other']} />
        </Field>
        <Field label="Account Number" required>
          <Input value={d.accountNumber} onChange={f('accountNumber')} placeholder="XXXX XXXX XXXX" />
        </Field>
        <Field label="IFSC Code" required>
          <Input value={d.ifsc} onChange={f('ifsc')} placeholder="HDFC0001234"
            style={{ textTransform: 'uppercase', letterSpacing: '1px' }} />
        </Field>
      </Grid>
      <SectionHead title="Loan Requirement" />
      <Grid>
        <Field label="Loan Type" required>
          <Select value={d.loanType} onChange={f('loanType')} placeholder="Select Loan Type"
            options={['Home Loan','Business Loan','Personal Loan','LAP','Education Loan','Vehicle Loan']} />
        </Field>
        <Field label="Loan Amount Required (₹)" required>
          <Input value={d.loanAmount} onChange={f('loanAmount')} placeholder="25,00,000" type="number" />
        </Field>
        <Field label="Existing Loan EMI / Month (₹)">
          <Input value={d.existingLoans} onChange={f('existingLoans')} placeholder="0" type="number" />
        </Field>
      </Grid>
    </div>
  );
}

function TabDocuments({ d, set }) {
  const f = key => file => set(p => ({ ...p, [key]: file }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SectionHead title="Identity & Address Proof" />
      <Grid>
        <Field label="PAN Card" required><FileUpload label="PAN Card" value={d.panCard} onChange={f('panCard')} /></Field>
        <Field label="Aadhaar Card" required><FileUpload label="Aadhaar Card" value={d.aadhaarCard} onChange={f('aadhaarCard')} /></Field>
        <Field label="Address Proof"><FileUpload label="Address Proof" value={d.addressProof} onChange={f('addressProof')} /></Field>
        <Field label="Passport Photo" required><FileUpload label="Photo" value={d.photo} onChange={f('photo')} /></Field>
      </Grid>
      <SectionHead title="Financial Documents" />
      <Grid>
        <Field label="Income Proof (Salary Slip / ITR)" required><FileUpload label="Income Proof" value={d.incomeProof} onChange={f('incomeProof')} /></Field>
        <Field label="Bank Statement (6 months)" required><FileUpload label="Bank Statement" value={d.bankStatement} onChange={f('bankStatement')} /></Field>
      </Grid>
    </div>
  );
}

/* ── Review row ── */
function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '10px 14px', borderBottom: '1px solid var(--color-border)',
    }}>
      <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)', width: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right' }}>
        {typeof value === 'object' ? value.name : value}
      </span>
    </div>
  );
}

function ReviewSection({ title, rows }) {
  const visible = rows.filter(r => r[1]);
  if (!visible.length) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px',
        color: 'var(--color-brand)', padding: '8px 14px',
        background: 'var(--color-brand-light)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
      }}>{title}</div>
      <div style={{ border: '1px solid var(--color-border)', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
        {visible.map(([label, value]) => <ReviewRow key={label} label={label} value={value} />)}
      </div>
    </div>
  );
}

function TabReview({ d, onSubmit, submitted }) {
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--color-success-bg)', border: '2px solid var(--color-success-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <CheckCircle size={36} color="var(--color-success)" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Application Submitted!</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
          Your customer onboarding application has been successfully submitted.<br />
          Our team will review and get back to you within 2–3 business days.
        </p>
        <div style={{
          marginTop: 20, display: 'inline-block',
          background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)',
          padding: '10px 20px', fontSize: 13, color: 'var(--color-text-secondary)',
        }}>
          Reference ID: <strong style={{ color: 'var(--color-brand)' }}>GGA-{Date.now().toString().slice(-6)}</strong>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        Please review all the information before submitting.
      </p>
      <ReviewSection title="Customer Details" rows={[
        ['First Name', d.firstName], ['Last Name', d.lastName],
        ['Date of Birth', d.dob], ['Gender', d.gender],
        ['PAN Number', d.pan], ['Aadhaar Number', d.aadhaar],
      ]} />
      <ReviewSection title="Contact Information" rows={[
        ['Primary Phone', d.phone], ['Alt Phone', d.altPhone],
        ['Email', d.email], ['Address Line 1', d.addressLine1],
        ['Address Line 2', d.addressLine2], ['City', d.city],
        ['State', d.state], ['Pincode', d.pincode],
      ]} />
      <ReviewSection title="Financial Details" rows={[
        ['Employment Type', d.employmentType], ['Annual Income', d.annualIncome ? `₹${Number(d.annualIncome).toLocaleString('en-IN')}` : ''],
        ['Company Name', d.companyName], ['Bank Name', d.bankName],
        ['Account Number', d.accountNumber], ['IFSC Code', d.ifsc],
        ['Loan Type', d.loanType], ['Loan Amount', d.loanAmount ? `₹${Number(d.loanAmount).toLocaleString('en-IN')}` : ''],
        ['Existing EMI', d.existingLoans ? `₹${Number(d.existingLoans).toLocaleString('en-IN')}/mo` : ''],
      ]} />
      <ReviewSection title="Documents Uploaded" rows={[
        ['PAN Card', d.panCard], ['Aadhaar Card', d.aadhaarCard],
        ['Address Proof', d.addressProof], ['Photo', d.photo],
        ['Income Proof', d.incomeProof], ['Bank Statement', d.bankStatement],
      ]} />

      <button
        onClick={onSubmit}
        className="btn btn-primary"
        style={{ marginTop: 8, height: 44, fontSize: 14, justifyContent: 'center' }}
      >
        <CheckCircle size={17} /> Submit Application
      </button>
    </div>
  );
}

/* ── Validate per tab ── */
function validate(tabId, d) {
  const errs = {};
  if (tabId === 'customer') {
    if (!d.firstName.trim()) errs.firstName = 'Required';
    if (!d.lastName.trim()) errs.lastName = 'Required';
    if (!d.dob) errs.dob = 'Required';
    if (!d.pan.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(d.pan.toUpperCase()))
      errs.pan = 'Invalid PAN format';
    if (!d.aadhaar.trim() || d.aadhaar.replace(/\s/g, '').length !== 12)
      errs.aadhaar = 'Must be 12 digits';
  }
  if (tabId === 'contact') {
    if (!d.phone.trim()) errs.phone = 'Required';
    if (!d.email.trim()) errs.email = 'Required';
    if (!d.addressLine1.trim()) errs.addressLine1 = 'Required';
    if (!d.city.trim()) errs.city = 'Required';
    if (!d.pincode.trim() || !/^\d{6}$/.test(d.pincode)) errs.pincode = '6-digit pincode';
  }
  return errs;
}

/* ── Main component ── */
function CustomerOnboarding() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [formData, setFormData] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentTab = TABS[activeIdx];

  const goTo = (idx) => {
    if (idx < activeIdx) { setActiveIdx(idx); return; }
    // Validate current before advancing
    const errs = validate(currentTab.id, formData);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setActiveIdx(idx);
  };

  const next = () => goTo(activeIdx + 1);
  const prev = () => setActiveIdx(i => Math.max(0, i - 1));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px' }}>Customer Onboarding</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginTop: 4 }}>
          Complete all sections to onboard a new financial customer
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
            Step {activeIdx + 1} of {TABS.length}
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-brand)' }}>
            {Math.round(((activeIdx + 1) / TABS.length) * 100)}% Complete
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--color-surface-3)', borderRadius: 99 }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg, var(--color-brand), #7C3AED)',
            width: `${((activeIdx + 1) / TABS.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Tab strip */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', paddingBottom: 4,
      }}>
        {TABS.map((tab, i) => {
          const Icon = tab.icon;
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <button
              key={tab.id}
              onClick={() => goTo(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: 'var(--radius-md)',
                border: active ? '2px solid var(--color-brand)' : done ? '2px solid var(--color-success-border)' : '2px solid var(--color-border)',
                background: active ? 'var(--color-brand-light)' : done ? 'var(--color-success-bg)' : 'var(--color-surface)',
                color: active ? 'var(--color-brand)' : done ? 'var(--color-success)' : 'var(--color-text-secondary)',
                fontWeight: active ? 700 : 500, fontSize: 13,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {done ? <CheckCircle size={15} /> : <Icon size={15} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form card */}
      <div className="card">
        <div style={{
          padding: '18px 24px 14px', borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {React.createElement(currentTab.icon, { size: 18, color: 'var(--color-brand)' })}
          <span style={{ fontWeight: 700, fontSize: 15 }}>{currentTab.label}</span>
        </div>
        <div style={{ padding: '24px 24px 20px' }}>
          {currentTab.id === 'customer'  && <TabCustomer  d={formData} set={setFormData} errors={errors} />}
          {currentTab.id === 'contact'   && <TabContact   d={formData} set={setFormData} errors={errors} />}
          {currentTab.id === 'financial' && <TabFinancial d={formData} set={setFormData} />}
          {currentTab.id === 'documents' && <TabDocuments d={formData} set={setFormData} />}
          {currentTab.id === 'review'    && (
            <TabReview d={formData} submitted={submitted}
              onSubmit={() => setSubmitted(true)} />
          )}
        </div>

        {/* Navigation footer */}
        {!submitted && (
          <div style={{
            padding: '14px 24px', borderTop: '1px solid var(--color-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--color-surface-2)',
          }}>
            <button
              className="btn btn-secondary" onClick={prev}
              disabled={activeIdx === 0}
              style={{ opacity: activeIdx === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={15} /> Previous
            </button>

            <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
              {currentTab.label}
            </span>

            {currentTab.id !== 'review' ? (
              <button className="btn btn-primary" onClick={next}>
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <div style={{ width: 100 }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerOnboarding;
