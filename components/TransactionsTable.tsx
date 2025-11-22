"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Expense, selectFilteredExpenses, useExpenseStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const formatDate = (value: string) => format(new Date(value), "MMM d, yyyy");

export function TransactionsTable() {
  const expenses = useExpenseStore(selectFilteredExpenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const categories = useExpenseStore((state) => state.categories);

  const [editing, setEditing] = useState<Expense | null>(null);

  const totals = useMemo(() => {
    return expenses.reduce(
      (acc, item) => {
        acc[item.type] += item.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [expenses]);

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const amount = Number.parseFloat((form.get("amount") as string) ?? "0");
    if (!Number.isFinite(amount) || amount <= 0) return;

    updateExpense({
      ...editing,
      title: (form.get("title") as string).trim(),
      amount,
      category: (form.get("category") as string).trim() || "Uncategorized",
      type: form.get("type") as Expense["type"],
      date: form.get("date") as string,
      notes: ((form.get("notes") as string) || "").trim() || undefined
    });
    setEditing(null);
  };

  return (
    <section className="card space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Activity</h2>
          <p className="text-sm text-muted">Monitor income and expenses by entry</p>
        </div>
        <div className="flex gap-4 text-sm text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-income" aria-hidden />
            Income {formatCurrency(totals.income)}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-expense" aria-hidden />
            Expense {formatCurrency(totals.expense)}
          </span>
        </div>
      </header>
      <div className="table-container overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-background/80 backdrop-blur">
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {expenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted">
                  No entries match your filters yet.
                </td>
              </tr>
            )}
            {expenses.map((expense) => (
              <tr key={expense.id} className="transition hover:bg-card-subtle/60">
                <td className="px-4 py-3 font-medium">{expense.title}</td>
                <td className="px-4 py-3 text-muted">{expense.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      expense.type === "income"
                        ? "bg-income/20 text-income"
                        : "bg-expense/20 text-expense"
                    }`}
                  >
                    {expense.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {expense.type === "income" ? "" : "-"}
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 text-muted max-w-xs">{expense.notes ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(expense)}
                      className="rounded-lg border border-slate-700 bg-card-subtle px-3 py-1 text-xs hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExpense(expense.id)}
                      className="rounded-lg border border-slate-700 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <dialog
          open
          className="fixed inset-0 z-50 mx-auto my-auto w-full max-w-xl rounded-2xl border border-slate-700 bg-card p-6 text-sm backdrop:bg-black/50"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit entry</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-700 bg-card-subtle px-3 py-1 text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col space-y-1">
                <span>Title</span>
                <input defaultValue={editing.title} name="title" required />
              </label>
              <label className="flex flex-col space-y-1">
                <span>Amount</span>
                <input
                  defaultValue={editing.amount}
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label className="flex flex-col space-y-1">
                <span>Category</span>
                <input list="edit-category-options" defaultValue={editing.category} name="category" />
                <datalist id="edit-category-options">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>
              <label className="flex flex-col space-y-1">
                <span>Date</span>
                <input defaultValue={editing.date} name="date" type="date" required />
              </label>
              <label className="flex flex-col space-y-1">
                <span>Type</span>
                <select defaultValue={editing.type} name="type">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>
              <label className="sm:col-span-2 flex flex-col space-y-1">
                <span>Notes</span>
                <textarea defaultValue={editing.notes} name="notes" rows={3} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-700 bg-card-subtle px-4 py-2 text-xs hover:bg-slate-800"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold">
                Save changes
              </button>
            </div>
          </form>
        </dialog>
      )}
    </section>
  );
}
