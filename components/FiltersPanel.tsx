"use client";

import { useMemo } from "react";
import { useExpenseStore } from "@/lib/store";

export function FiltersPanel() {
  const filters = useExpenseStore((state) => state.filters);
  const setFilters = useExpenseStore((state) => state.setFilters);
  const resetFilters = useExpenseStore((state) => state.resetFilters);
  const categories = useExpenseStore((state) => state.categories);

  const sortedCategories = useMemo(() => categories.slice().sort((a, b) => a.localeCompare(b)), [categories]);

  const toggleCategory = (category: string) => {
    setFilters({
      categories: filters.categories.includes(category)
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category]
    });
  };

  const handleTypeChange = (type: typeof filters.type) => setFilters({ type });

  return (
    <aside className="card fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-lg border border-slate-700 bg-card-subtle px-3 py-1 text-xs font-medium text-foreground hover:bg-slate-800"
        >
          Clear
        </button>
      </div>
      <div className="space-y-6 text-sm">
        <label className="flex flex-col space-y-2">
          <span>Search</span>
          <input
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            placeholder="Search title or notes"
          />
        </label>
        <div className="grid gap-3">
          <span className="text-sm font-medium">Date range</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col space-y-1">
              <span className="text-xs text-muted">From</span>
              <input
                type="date"
                value={filters.startDate ?? ""}
                onChange={(event) => setFilters({ startDate: event.target.value || undefined })}
              />
            </label>
            <label className="flex flex-col space-y-1">
              <span className="text-xs text-muted">To</span>
              <input
                type="date"
                value={filters.endDate ?? ""}
                onChange={(event) => setFilters({ endDate: event.target.value || undefined })}
              />
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium">Type</span>
          <div className="flex gap-2">
            {(["all", "expense", "income"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleTypeChange(option)}
                className={`flex-1 rounded-lg border px-3 py-1 capitalize transition ${
                  filters.type === option ? "border-accent bg-accent/10" : "border-slate-700 bg-card-subtle"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <span className="text-sm font-medium">Categories</span>
          <div className="grid grid-cols-2 gap-2">
            {sortedCategories.map((category) => {
              const active = filters.categories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`truncate rounded-xl border px-3 py-1 text-xs font-medium transition ${
                    active ? "border-accent bg-accent/10 text-accent" : "border-slate-700 bg-card-subtle"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
