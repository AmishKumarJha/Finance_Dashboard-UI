import type { ReactNode } from "react";

interface Props {
  title: string;
  amount: number;
}

const SummaryCard = ({ title, amount }: Props) => {
  let layout = "left";
  let icon: ReactNode = null;
  let colorClass = "text-slate-800 dark:text-white";
  let iconBgClass = "";
  let iconColorClass = "";
  let gradientClass = "";

  if (title === "Balance") {
    layout = "left";
    colorClass = "text-amber-500 dark:text-amber-400";
    iconBgClass = "bg-amber-100 dark:bg-amber-500/20";
    iconColorClass = "text-amber-600 dark:text-amber-400";
    gradientClass = "from-amber-500/10";
    icon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  } else if (title === "Income") {
    layout = "left";
    colorClass = "text-emerald-500 dark:text-emerald-400";
    iconBgClass = "bg-emerald-100 dark:bg-emerald-500/20";
    iconColorClass = "text-emerald-600 dark:text-emerald-400";
    gradientClass = "from-emerald-500/10";
    icon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    );
  } else if (title === "Expenses") {
    layout = "left";
    colorClass = "text-rose-500 dark:text-rose-400";
    iconBgClass = "bg-rose-100 dark:bg-rose-500/20";
    iconColorClass = "text-rose-600 dark:text-rose-400";
    gradientClass = "from-rose-500/10";
    icon = (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {layout === "left" && icon ? (
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-4 rounded-2xl ${iconBgClass} ${iconColorClass} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-sm mb-1">{title}</h3>
            <p className={`text-3xl font-extrabold ${colorClass}`}>₹{amount.toLocaleString()}</p>
          </div>
        </div>
      ) : layout === "between" && icon ? (
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-sm mb-1">{title}</h3>
            <p className={`text-3xl font-extrabold ${colorClass}`}>₹{amount.toLocaleString()}</p>
          </div>
          <div className={`p-4 rounded-2xl ${iconBgClass} ${iconColorClass} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      ) : (
        // Fallback layout if no recognized title
        <div className="relative z-10">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-sm">{title}</h3>
          <p className="text-3xl font-extrabold mt-3 text-slate-800 dark:text-white">₹{amount.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;