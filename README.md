# Finance Dashboard 💸

A fully interactive, deeply personalized personal finance dashboard for tracking income and expenses. This project focuses intensely on delivering a premium, smooth user experience through modern visually-stunning design choices (glassmorphism) while supporting robust architectural patterns strictly utilizing built-in React methodologies.

---

## 🚀 Overview of Approach

The goal of this dashboard was to decouple complex View logic from Business layer state logic, ensuring components are snappy, reusable, and predictable.

### State Management
Instead of immediately reaching for an external, heavy dependency like Redux or Zustand, this app enforces a deeply scalable architecture utilizing **React's built-in Context API (`FinanceContext.tsx`)**. 

1. **Global Provider Pattern**: All core data (transactions history, chosen month filters, custom themes, math-derived statistics) safely lives in a centralized provider context wrapping the application. 
2. **Eliminating Prop-Drilling**: Child components invoke a custom `useFinance` hook to pull only the strictly necessary state exactly when they need it, completely bypassing the "prop-drilling" anti-pattern.
3. **Optimized Math Derivation**: Financial calculations (total sum reductions, filtered tracking arrays, sorted histories) are safely cached using React's `useMemo` hooks inside the provider. This guarantees computationally heavy functions are exclusively recalculated *only* when dependent transaction records physically mutate.

---

## ✨ Features

- **Premium UI & Glassmorphism Design:** Vibrant light and dark modes utilizing transparent frosted glass cards, dynamic micro-animations on hover interactions, and responsive grid layouts driven by `TailwindCSS v3`.
- **Intelligent Global Month Filtering:** Users easily scrub back dynamically generated unique timestamps representing active months tracking their spending. Changing the timeline automatically refilters the entire board's charts, math aggregations, and insights.
- **Smart Role Switcher:** Toggles instantly between an 'admin' and 'viewer' configuration. Admins achieve full mutating Read/Write authorization enabling row-level editing workflows and record creations. Modifying an old transaction directly triggers cascade updates accurately rebuilding the dashboard.
- **Simulated AI Insights Generator:** A customized logic-bot that quickly processes active transaction loads behind a "thinking" UI state, dynamically emitting personalized textual feedback prioritizing highest-tracked expense categories without depending on external costly APIs.
- **Dynamic 3D & Spline Visualizations:** Render precise historical data tracking through responsive Google 3D Pie Charts natively matched against `recharts`-powered spline density history analysis.
- **Export Integrity:** Fully interactive JSON and CSV bulk data exporter capabilities supporting robust local archiving workflows directly generated from the client's current filter selection schema!

---

## 🛠️ Setup Instructions

This project targets Node.js `v20.19+` internally executing against Vite for ultra-fast compilation. 

### 1. Clone the Repository
Pull the code tracking locally to your workspace environment.
```bash
git clone <https://github.com/AmishKumarJha/Finance_Dashboard-UI.git>
cd Finance_Dashboard
```

### 2. Install Project Dependencies
Run the standard package installation process to fetch `react`, `vite`, `tailwindcss`, `recharts`, and additional core extensions required by the application map.
```bash
npm install
```

### 3. Start Local Development Server
Execute the Vite tooling platform targeting localhost viewing. This will host your application natively at `localhost:5173`.
```bash
npm run dev
```

### 4. Build for Production Deployment
To confidently emulate how Vercel constructs the application prior to runtime execution, strictly target the type-verification complier natively attached.
```bash
npm run build
```
