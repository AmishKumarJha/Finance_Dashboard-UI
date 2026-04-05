import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { useFinance } from "../context/FinanceContext";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

const options = {
  is3D: true,
  backgroundColor: "transparent",
  legend: "none", // ✨ We are hiding the default ugly legend to build our own!
  colors: COLORS,
  chartArea: { width: "100%", height: "100%" }, // Maximize chart size
};

const PieChartComponent = () => {
  const { filteredTransactions: transactions } = useFinance();
  const { chartData, categoryStats, totalExpenses } = useMemo(() => {
    const expensesMap: Record<string, number> = {};
    let total = 0;

    transactions.forEach((t) => {
      if (t.type === "expense") {
        expensesMap[t.category] = (expensesMap[t.category] || 0) + t.amount;
        total += t.amount;
      }
    });

    const dataArray: any[] = [["Category", "Amount"]];
    const statsArray: { name: string; value: number; percentage: number; color: string }[] = [];

    let colorIndex = 0;
    Object.entries(expensesMap)
      .sort((a, b) => b[1] - a[1]) // Sort from highest to lowest
      .forEach(([name, value]) => {
        dataArray.push([name, value]);
        statsArray.push({
          name,
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
          color: COLORS[colorIndex % COLORS.length],
        });
        colorIndex++;
      });

    return { chartData: dataArray, categoryStats: statsArray, totalExpenses: total };
  }, [transactions]);

  if (chartData.length <= 1) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-white dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300 w-full overflow-hidden flex items-center justify-center h-full min-h-[300px]">
        <p className="text-slate-500 dark:text-slate-400">No expenses yet to show breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300 w-full overflow-hidden animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Spending Breakdown</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: 3D Chart */}
        <div className="w-full flex justify-center items-center h-[280px]">
          <Chart
            chartType="PieChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"100%"}
          />
        </div>

        {/* Right Side: Custom Rich Legend */}
        <div className="flex flex-col gap-4">
          <div className="bg-indigo-50/50 dark:bg-slate-700/30 p-4 rounded-2xl border border-indigo-100/50 dark:border-slate-600/50 mb-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Total Expenses Displayed</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white">₹{totalExpenses.toLocaleString()}</p>
          </div>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {categoryStats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: stat.color }}
                    ></span>
                    <span className="text-slate-700 dark:text-slate-300">{stat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 dark:text-white">₹{stat.value.toLocaleString()}</span>
                    <span className="text-slate-400 text-xs w-10 text-right">({stat.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;