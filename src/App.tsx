import { useState, useEffect, useMemo } from "react";
import SummaryCard from "./components/SummaryCard";
import LineChartComponent from "./components/LineChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import TransactionTable from "./components/TransactionTable";
import RoleSwitcher from "./components/RoleSwitcher";
import AddTransaction from "./components/AddTransaction";
import Insights from "./components/Insights";
import AISummary from "./components/AISummary";
import type { Role } from "./types";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

function App() {
  const [role, setRole] = useState<Role>("viewer");
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ✅ Load from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("transactions");
      if (saved && saved !== "undefined") {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error parsing transactions from local storage:", error);
    }
    return [
      {
        id: 1,
        date: "2026-04-01",
        amount: 5000,
        category: "Salary",
        type: "income",
      },
      {
        id: 2,
        date: "2026-04-02",
        amount: 1200,
        category: "Food",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-04-03",
        amount: 500,
        category: "Electricity Bill",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-04",
        amount: 150,
        category: "Mobile Recharge",
        type: "expense",
      },
    ];
  });

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ✅ Month Filtering
  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => t.date.substring(0, 7)));
    
    // Always include the last 12 months to allow navigating to empty months
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      months.add(`${year}-${month}`);
      today.setMonth(today.getMonth() - 1);
    }

    return Array.from(months).sort().reverse();
  }, [transactions]);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const filteredTransactions = useMemo(() => {
    if (selectedMonth === "all") return transactions;
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // ✅ Calculations
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  // ✅ Add transaction handler
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  // ✅ Edit transaction handler
  const handleEditTransaction = (updated: Transaction) => {
    setTransactions((prev) => 
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 md:p-10 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm tracking-tight pt-2 pb-2">
          Finance Dashboard
        </h1>
        
        <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-50 dark:border-slate-700 shadow-sm flex-wrap justify-end">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-100 font-medium outline-none cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-slate-800">All Months</option>
            {availableMonths.map((m) => {
              const [year, month] = m.split("-");
              const dateObj = new Date(Number(year), Number(month) - 1);
              return (
                <option key={m} value={m} className="bg-white dark:bg-slate-800">
                  {dateObj.toLocaleString("default", { month: "short", year: "numeric" })}
                </option>
              );
            })}
          </select>
          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1"></div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-white dark:bg-slate-700 rounded-full hover:scale-110 hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-600"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1"></div>
          <RoleSwitcher role={role} setRole={setRole} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Balance" amount={balance} />
        <SummaryCard title="Income" amount={income} />
        <SummaryCard title="Expenses" amount={expenses} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <LineChartComponent transactions={filteredTransactions} />
        <PieChartComponent transactions={filteredTransactions} />
      </div>

      {/* Insights */}
      <Insights transactions={filteredTransactions} />

      {/* AI Summary Simulation */}
      <AISummary transactions={filteredTransactions} />

      {/* Admin only */}
      {role === "admin" && (
        <AddTransaction onAdd={handleAddTransaction} />
      )}

      {/* Table */}
      <TransactionTable 
        transactions={filteredTransactions} 
        onEdit={handleEditTransaction}
        role={role}
      />
    </div>
  );
}

export default App;