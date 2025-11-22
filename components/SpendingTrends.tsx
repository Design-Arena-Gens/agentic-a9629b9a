"use client";

import { useMemo } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { format } from "date-fns";
import { selectFilteredExpenses, useExpenseStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler, ArcElement, Legend);

export function SpendingTrends() {
  const expenses = useExpenseStore(selectFilteredExpenses);

  const trendData = useMemo(() => {
    const buckets = new Map<string, { income: number; expense: number }>();
    expenses.forEach((entry) => {
      const key = format(new Date(entry.date), "yyyy-MM");
      if (!buckets.has(key)) {
        buckets.set(key, { income: 0, expense: 0 });
      }
      const bucket = buckets.get(key)!;
      bucket[entry.type] += entry.amount;
    });

    const sortedKeys = Array.from(buckets.keys()).sort();
    const labels = sortedKeys.map((key) => format(new Date(`${key}-01`), "MMM yyyy"));

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: sortedKeys.map((key) => buckets.get(key)!.income),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          fill: true,
          tension: 0.35
        },
        {
          label: "Expenses",
          data: sortedKeys.map((key) => buckets.get(key)!.expense),
          borderColor: "#f87171",
          backgroundColor: "rgba(248, 113, 113, 0.15)",
          fill: true,
          tension: 0.35
        }
      ]
    };
  }, [expenses]);

  const categoryData = useMemo(() => {
    const spend = expenses.filter((entry) => entry.type === "expense");
    const totals = spend.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + entry.amount;
      return acc;
    }, {});

    const labels = Object.keys(totals);
    const data = Object.values(totals);

    const palette = ["#38bdf8", "#c084fc", "#facc15", "#fb7185", "#f472b6", "#2dd4bf", "#f97316", "#a855f7"];

    return {
      labels,
      datasets: [
        {
          label: "Spending by category",
          data,
          backgroundColor: labels.map((_, index) => palette[index % palette.length]),
          borderWidth: 0
        }
      ]
    };
  }, [expenses]);

  return (
    <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
      <article className="card space-y-4">
        <header>
          <h2 className="text-lg font-semibold">Cash flow trend</h2>
          <p className="text-sm text-muted">Visualize how income and expenses shift over time</p>
        </header>
        <div className="h-[300px]">
          {trendData.labels.length ? (
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => formatCurrency(value as number),
                      color: "#94a3b8"
                    },
                    grid: {
                      color: "rgba(148, 163, 184, 0.12)"
                    }
                  },
                  x: {
                    ticks: {
                      color: "#94a3b8"
                    },
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "#e2e8f0"
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${formatCurrency(Number(context.parsed.y))}`
                    }
                  }
                }
              }}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-700 bg-card-subtle p-6 text-center text-sm text-muted">
              Add more entries to unlock trend insights.
            </p>
          )}
        </div>
      </article>
      <article className="card space-y-4">
        <header>
          <h2 className="text-lg font-semibold">Category split</h2>
          <p className="text-sm text-muted">See where your spending concentrates</p>
        </header>
        <div className="mx-auto h-[300px] w-full max-w-xs">
          {categoryData.labels.length ? (
            <Doughnut
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#e2e8f0"
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${formatCurrency(Number(context.parsed) ?? 0)}`
                    }
                  }
                }
              }}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-700 bg-card-subtle p-6 text-center text-sm text-muted">
              Once you record expenses, categories will show up here.
            </p>
          )}
        </div>
      </article>
    </section>
  );
}
