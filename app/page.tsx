import { ExpenseForm } from "@/components/ExpenseForm";
import { FiltersPanel } from "@/components/FiltersPanel";
import { SpendingTrends } from "@/components/SpendingTrends";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionsTable } from "@/components/TransactionsTable";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-accent">Expense Compass</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Your personal finance mission control</h1>
            <p className="text-sm text-muted md:text-base">
              Capture income and expenses, surface trends, and steer your money decisions with live insights.
            </p>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm shadow-lg">
            <p className="font-semibold text-accent">Tip</p>
            <p className="text-foreground/80">Use filters to simulate budgets across months or categories.</p>
          </div>
        </div>
      </header>
      <SummaryCards />
      <section className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <div className="space-y-6">
          <SpendingTrends />
          <TransactionsTable />
        </div>
        <div className="space-y-6">
          <ExpenseForm />
          <FiltersPanel />
        </div>
      </section>
      <footer className="py-6 text-center text-xs text-muted">
        Built with Next.js · Data persists locally in your browser
      </footer>
    </main>
  );
}
