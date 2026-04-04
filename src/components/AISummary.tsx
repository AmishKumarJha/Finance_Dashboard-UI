import { useState, useEffect } from "react";

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

const AISummary = ({ transactions }: Props) => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-reset the generated summary when the user switches months or modifies data
    setSummary("");
  }, [transactions]);

  const generateSummary = () => {
    setLoading(true);
    
    // Simulating an AI API call with a 1.5s delay
    setTimeout(() => {
      let totalIncome = 0;
      let totalExpense = 0;
      let categoryMap: Record<string, number> = {};

      transactions.forEach((t) => {
        if (t.type === "income") totalIncome += t.amount;
        else {
          totalExpense += t.amount;
          categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        }
      });

      const topCategory = Object.entries(categoryMap).sort(
        (a, b) => b[1] - a[1]
      )[0];

      const text = `📊 AI Insights:\n\n• Your total income is ₹${totalIncome.toLocaleString()} and expenses are ₹${totalExpense.toLocaleString()}.\n\n• Highest spending category: ${topCategory?.[0] || "N/A"}.\n\n• ${
        totalIncome > totalExpense
          ? "Great job! You are saving money this month 🎉"
          : "Your expenses are higher than your income. Try to reduce spending ⚠️"
      }`;

      setSummary(text);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mt-6 transition-all duration-300 animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">🤖 AI Summary</h2>

      <button
        onClick={generateSummary}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-6 py-3 rounded-full mb-4 shadow-md hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating AI insights...
          </>
        ) : (
          "✨ Generate AI Insights"
        )}
      </button>

      {loading ? (
        <div className="animate-pulse bg-indigo-50/50 dark:bg-slate-700/30 rounded-2xl p-6 mt-2 border border-indigo-100/50 dark:border-slate-600/50">
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
        </div>
      ) : summary ? (
        <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-line bg-indigo-50/50 dark:bg-slate-700/30 p-6 rounded-2xl border border-indigo-100/50 dark:border-slate-600/50 font-sans leading-relaxed mt-2 text-md animate-fadeIn">
          {summary}
        </pre>
      ) : null}
    </div>
  );
};

export default AISummary;
