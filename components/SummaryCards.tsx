"use client";

import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { selectFilteredExpenses, useExpenseStore } from "@/lib/store";
import { average, formatCurrency, formatDelta, formatPercent } from "@/lib/utils";

export function SummaryCards() {
  const expenses = useExpenseStore(selectFilteredExpenses);

  const { totals, net, burnRate, topCategory } = useMemo(() => {
    const incomes = expenses.filter((item) => item.type === "income");
    const spend = expenses.filter((item) => item.type === "expense");

    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
    const totalExpense = spend.reduce((acc, item) => acc + item.amount, 0);
    const sortedByDate = expenses.slice().sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    const rangeDays = sortedByDate.length
      ? Math.max(1, differenceInDays(parseISO(sortedByDate.at(-1)!.date), parseISO(sortedByDate[0].date)))
      : 1;
    const burnRate = totalExpense / (rangeDays / 30);

    const categoryTotals = spend.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .at(0);

    return {
      totals: { income: totalIncome, expense: totalExpense },
      net: totalIncome - totalExpense,
      burnRate,
      topCategory
    };
  }, [expenses]);

  const savingsRate = useMemo(() => {
    if (totals.income === 0) return 0;
    return (totals.income - totals.expense) / totals.income;
  }, [totals]);

  const averageTicket = useMemo(() => average(expenses.filter((item) => item.type === "expense").map((item) => item.amount)), [expenses]);

  const cards = [
    {
      title: "Total income",
      value: formatCurrency(totals.income),
      sub: savingsRate ? `${formatPercent(savingsRate)} savings rate` : "Track more income entries"
    },
    {
      title: "Total spent",
      value: formatCurrency(totals.expense),
      sub: averageTicket ? `${formatCurrency(averageTicket)} avg. ticket` : "Log an expense to begin",
      accent: "expense"
    },
    {
      title: "Net balance",
      value: formatCurrency(net),
      sub: formatDelta(net),
      accent: net >= 0 ? "income" : "expense"
    },
    {
      title: "Monthly burn",
      value: formatCurrency(Number.isFinite(burnRate) ? burnRate : 0),
      sub: topCategory ? `${topCategory[0]} leads spending` : "No expenses yet"
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.title} className="card space-y-3">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">{card.title}</h3>
            {card.accent && (
              <span
                className={`h-2 w-2 rounded-full ${card.accent === "income" ? "bg-income" : "bg-expense"}`}
                aria-hidden
              />
            )}
          </header>
          <p className="text-2xl font-semibold">{card.value}</p>
          <p className="text-xs text-muted">{card.sub}</p>
        </article>
      ))}
    </section>
  );
}
