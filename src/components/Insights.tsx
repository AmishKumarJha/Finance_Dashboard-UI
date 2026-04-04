import { useMemo } from "react";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

interface Props {
  transactions: Transaction[];
}

const Insights = ({ transactions }: Props) => {
  const insights = useMemo(() => {
    let categoryMap: Record<string, number> = {};
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "expense") {
        totalExpense += t.amount;
        categoryMap[t.category] =
          (categoryMap[t.category] || 0) + t.amount;
      }
    });

    const topCategory = Object.entries(categoryMap).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      topCategory: topCategory ? topCategory[0] : "N/A",
      totalExpense,
    };
  }, [transactions]);

  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mt-6 transition-all duration-300 animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">✨ Insights</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-slate-700/30 rounded-2xl border border-indigo-100/50 dark:border-slate-600/50">
          <p className="text-slate-600 dark:text-slate-300 font-medium">Highest spending category</p>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1 rounded-full">{insights.topCategory}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-slate-700/30 rounded-2xl border border-purple-100/50 dark:border-slate-600/50">
          <p className="text-slate-600 dark:text-slate-300 font-medium">Total expenses</p>
          <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded-full">₹{insights.totalExpense.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Insights;