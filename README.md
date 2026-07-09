# FinBowl — Disbursement Management Platform

> **Frontend Developer Take-Home Assignment** — Gracia Global Advisory LLP

A pixel-accurate, production-ready React implementation of the FinBowl disbursement management UI.

---

## 🚀 Getting Started

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
```

---

## 🗂 Project Structure

```
src/
├── data/
│   └── mockData.js                    # Realistic loan disbursement records
├── components/
│   ├── Sidebar.jsx                    # Navigation sidebar
│   └── DisbursementDetailPanel.jsx   # Slide-out detail drawer (4 tabs)
├── pages/
│   ├── Dashboard.jsx                  # Overview / KPI page
│   └── DisbursementsPage.jsx          # Main table with search, filter, sort
├── App.jsx                            # Root shell + page routing
├── main.jsx                           # React entry point
└── index.css                          # Full design system (CSS custom properties)
```

---

## ✨ Features

### Disbursements Table

- **Search** by Disbursement ID, applicant name, bank, or loan ID
- **Filter** by status (Submitted / Verified / Processed / Audited) and bank
- **Sortable columns** — ID, Date, Sanctioned Amt, Verified Amt
- **Pagination** — 8 rows per page with page controls
- Credit Executive avatars with initials

### Detail Slide-out Panel

| Tab              | Content                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| **Overview**     | Applicant info, PAN, DOB, address, loan details, co-applicants, notes    |
| **Tranches**     | Per-tranche table: amounts, UTR numbers, verified amounts, status        |
| **Commission**   | Rate, total commission, referral fee, broker info, per-tranche breakdown |
| **Activity Log** | Chronological audit trail with before/after change indicators            |

### Real-world States Handled

| State       | Implementation                                  |
| ----------- | ----------------------------------------------- |
| **Loading** | Skeleton rows with shimmer animation            |
| **Error**   | Error card with Retry button                    |
| **Empty**   | Empty state illustration when no search results |

---

## 🛠 Tech Stack

| Concern    | Choice                                                |
| ---------- | ----------------------------------------------------- |
| Framework  | React 18 + Vite                                       |
| Styling    | Vanilla CSS (design tokens via CSS custom properties) |
| Icons      | lucide-react                                          |
| Typography | Inter — Google Fonts                                  |
| State      | useState, useMemo, useCallback (no extra libs)        |

---

## 🔌 Bonus — Connecting to a Live API

```jsx
// Replace mock data with a real API call like this:
const [data, setData] = useState([]);
const [status, setStatus] = useState("loading"); // 'loading' | 'error' | 'loaded'
const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  const controller = new AbortController();
  setStatus("loading");

  fetch("/api/disbursements", { signal: controller.signal })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((json) => {
      setData(json);
      setStatus("loaded");
    })
    .catch((err) => {
      if (err.name !== "AbortError") setStatus("error");
    });

  return () => controller.abort(); // cancel on unmount / re-fetch
}, [refreshKey]);

// Retry / refresh:
// <button onClick={() => setRefreshKey(k => k + 1)}>Retry</button>
```

- **Loading** → skeleton rows shown during fetch
- **Error** → error card + Retry button increments `refreshKey` to re-trigger `useEffect`
- **Refreshing** → same `refreshKey` pattern; can also be used for a manual "Refresh" button

---
