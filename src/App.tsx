import SummaryCard from "./components/SummaryCard";
import LineChartComponent from "./components/LineChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import TransactionTable from "./components/TransactionTable";
import RoleSwitcher from "./components/RoleSwitcher";
import AddTransaction from "./components/AddTransaction";
import Insights from "./components/Insights";
import AISummary from "./components/AISummary";
import { useFinance } from "./context/FinanceContext";

function App() {
  const {
    role,
    darkMode,
    setDarkMode,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    income,
    expenses,
    balance,
  } = useFinance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/80 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 md:p-10 text-slate-800 dark:text-slate-100 transition-colors duration-500">
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
          <RoleSwitcher />
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
        <LineChartComponent />
        <PieChartComponent />
      </div>

      {/* Insights */}
      <Insights />

      {/* AI Summary Simulation */}
      <AISummary />

      {/* Admin only */}
      {role === "admin" && (
        <AddTransaction />
      )}

      {/* Table */}
      <TransactionTable />
    </div>
  );
}

export default App;