"use client";

import { useState } from "react";
import { formatISO } from "date-fns";
import { useExpenseStore } from "@/lib/store";

export function ExpenseForm() {
  const today = formatISO(new Date(), { representation: "date" });
  const addExpense = useExpenseStore((state) => state.addExpense);
  const categories = useExpenseStore((state) => state.categories);
  const upsertCategory = useExpenseStore((state) => state.upsertCategory);

  type FormState = {
    title: string;
    amount: string;
    category: string;
    type: "income" | "expense";
    date: string;
    notes: string;
  };

  const buildInitialState = (): FormState => ({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    date: formatISO(new Date(), { representation: "date" }),
    notes: ""
  });

  const [form, setForm] = useState<FormState>(buildInitialState);

  const [error, setError] = useState<string | null>(null);

  const handleChange = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(buildInitialState());
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Add a description to keep tabs on this entry.");
      return;
    }

    const amount = Number.parseFloat(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount should be greater than zero.");
      return;
    }

    const category = form.category.trim() || "Uncategorized";

    addExpense({
      title: form.title.trim(),
      amount,
      category,
      type: form.type,
      date: form.date,
      notes: form.notes.trim() || undefined
    });
    upsertCategory(category);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="card fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Log a new entry</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col space-y-2 text-sm">
          <span>Title</span>
          <input
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="E.g. Coffee run"
            required
          />
        </label>
        <label className="flex flex-col space-y-2 text-sm">
          <span>Amount</span>
          <input
            value={form.amount}
            onChange={(event) => handleChange("amount", event.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </label>
        <label className="flex flex-col space-y-2 text-sm">
          <span>Date</span>
          <input
            value={form.date}
            onChange={(event) => handleChange("date", event.target.value)}
            type="date"
            max={today}
            required
          />
        </label>
        <label className="flex flex-col space-y-2 text-sm">
          <span>Category</span>
          <input
            list="category-options"
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            placeholder="Add or pick a category"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        <fieldset className="col-span-full flex flex-wrap gap-2 text-sm">
          <legend className="mb-2 w-full text-sm">Entry type</legend>
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-card-subtle px-4 py-2">
            <input
              type="radio"
              name="entry-type"
              value="expense"
              checked={form.type === "expense"}
              onChange={() => handleChange("type", "expense")}
            />
            <span>Expense</span>
          </label>
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-card-subtle px-4 py-2">
            <input
              type="radio"
              name="entry-type"
              value="income"
              checked={form.type === "income"}
              onChange={() => handleChange("type", "income")}
            />
            <span>Income</span>
          </label>
        </fieldset>
      </div>
      <label className="flex flex-col space-y-2 text-sm">
        <span>Notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          placeholder="Add optional notes"
          rows={3}
        />
      </label>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="rounded-lg border border-slate-700 bg-card-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-slate-800"
        >
          Reset
        </button>
        <button type="submit" className="px-5 py-2 text-sm font-semibold">
          Add entry
        </button>
      </div>
    </form>
  );
}
