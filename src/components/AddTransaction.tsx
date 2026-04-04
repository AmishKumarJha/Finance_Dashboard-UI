import { useState } from "react";

interface Props {
  onAdd: (transaction: any) => void;
}

const AddTransaction = ({ onAdd }: Props) => {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.amount || !form.category) return;

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: Date.now(),
    });

    setForm({ date: "", amount: "", category: "", type: "expense" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mt-6 transition-all duration-300 animate-slideUp"
    >
      <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">➕ Add Transaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="date"
          className="border dark:border-gray-700 p-2 rounded dark:bg-gray-700 dark:text-white"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border dark:border-gray-700 p-2 rounded dark:bg-gray-700 dark:text-white"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category"
          className="border dark:border-gray-700 p-2 rounded dark:bg-gray-700 dark:text-white"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <select
          className="border dark:border-gray-700 p-2 rounded dark:bg-gray-700 dark:text-white"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AddTransaction;