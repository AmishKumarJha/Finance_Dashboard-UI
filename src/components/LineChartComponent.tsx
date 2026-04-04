import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const LineChartComponent = ({ transactions }: Props) => {
  const data = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let currentBalance = 0;
    const balanceByDate: Record<string, number> = {};

    sorted.forEach((t) => {
      if (t.type === "income") {
        currentBalance += t.amount;
      } else {
        currentBalance -= t.amount;
      }

      const dateObj = new Date(t.date);
      const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })}`;
      balanceByDate[formattedDate] = currentBalance;
    });

    return Object.entries(balanceByDate).map(([date, balance]) => ({
      date,
      balance,
    }));
  }, [transactions]);
  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300 w-full overflow-hidden animate-fadeIn">
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Trend Analysis</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;