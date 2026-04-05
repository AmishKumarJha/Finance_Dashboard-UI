import { useState } from "react";
import type { Transaction } from "../context/FinanceContext";
import { useFinance } from "../context/FinanceContext";

const TransactionTable = () => {
  const { filteredTransactions: transactions, role, editTransaction: onEdit } = useFinance();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const startEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ ...t });
  };

  const handleSave = () => {
    if (editForm) {
      onEdit(editForm);
    }
    setEditingId(null);
    setEditForm(null);
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const filteredData = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Type"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((t) => `${t.date},${t.category},${t.amount},${t.type}`)
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-900/10 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mt-6 transition-all duration-300 overflow-hidden animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">📋 Transactions</h2>
        <div className="relative">
          <button 
            onClick={() => setShowDownloadOptions(!showDownloadOptions)} 
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-600 shadow-sm active:scale-95 flex items-center gap-2"
          >
            ⬇️ Download
          </button>
          
          {showDownloadOptions && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-10 animate-fadeIn">
              <button 
                onClick={() => { handleExportCSV(); setShowDownloadOptions(false); }} 
                className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                As CSV
              </button>
              <button 
                onClick={() => { handleExportJSON(); setShowDownloadOptions(false); }} 
                className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                As JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search category..."
          className="border dark:border-gray-700 p-2 rounded w-full md:w-1/2 dark:bg-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border dark:border-gray-700 p-2 rounded w-full md:w-1/4 dark:bg-gray-700 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2">Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((t) => (
                <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                  {editingId === t.id && editForm ? (
                    <>
                      <td className="py-2">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                          className="border dark:border-gray-700 p-1 rounded dark:bg-gray-700 dark:text-white w-full min-w-[120px]"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="border dark:border-gray-700 p-1 rounded dark:bg-gray-700 dark:text-white w-full min-w-[120px]"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                          className="border dark:border-gray-700 p-1 rounded dark:bg-gray-700 dark:text-white w-full min-w-[80px]"
                        />
                      </td>
                      <td>
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                          className="border dark:border-gray-700 p-1 rounded dark:bg-gray-700 dark:text-white w-full min-w-[100px]"
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </td>
                      {role === "admin" && (
                        <td className="space-x-2">
                          <button onClick={handleSave} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">Save</button>
                          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 font-semibold text-sm">Cancel</button>
                        </td>
                      )}
                    </>
                  ) : (
                    <>
                      <td className="py-2">{t.date}</td>
                      <td>{t.category}</td>
                      <td>₹{t.amount}</td>
                      <td
                        className={
                          t.type === "income" ? "text-green-600" : "text-red-600"
                        }
                      >
                        {t.type}
                      </td>
                      {role === "admin" && (
                        <td>
                          <button
                            onClick={() => startEdit(t)}
                            className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                          >
                            Edit
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === "admin" ? 5 : 4} className="text-center py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;