import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Role } from '../types';

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

interface FinanceContextType {
  // State
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  role: Role;
  darkMode: boolean;
  selectedMonth: string;
  availableMonths: string[];
  
  // Math Derivations
  income: number;
  expenses: number;
  balance: number;

  // Actions
  setRole: (role: Role) => void;
  setDarkMode: (mode: boolean) => void;
  setSelectedMonth: (month: string) => void;
  addTransaction: (tx: Transaction) => void;
  editTransaction: (tx: Transaction) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
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
      { id: 1, date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
      { id: 2, date: "2026-04-02", amount: 1200, category: "Food", type: "expense" },
      { id: 3, date: "2026-04-03", amount: 500, category: "Electricity Bill", type: "expense" },
      { id: 4, date: "2026-04-04", amount: 150, category: "Mobile Recharge", type: "expense" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => t.date.substring(0, 7)));
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

  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const addTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const editTransaction = (updated: Transaction) => {
    setTransactions((prev) => 
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const value = {
    transactions,
    filteredTransactions,
    role,
    darkMode,
    selectedMonth,
    availableMonths,
    income,
    expenses,
    balance,
    setRole,
    setDarkMode,
    setSelectedMonth,
    addTransaction,
    editTransaction,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
