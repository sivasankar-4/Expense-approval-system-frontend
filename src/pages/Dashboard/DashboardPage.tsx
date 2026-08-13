import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { expenseService } from "@/services/expense/expenseService";
import type { Expense } from "@/types/expense";

const recentExpensesLimit = 5;

import {
  calculateExpenseStats,
  formatAmount,
  formatDate,
  statusClasses,
  statusLabels,
} from "@/utils/expenseUtils";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await expenseService.getAllExpenses();

        if (isMounted) {
          setExpenses(data);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load dashboard data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  const { statistics, recentExpenses } = useMemo(() => {
    const stats = calculateExpenseStats(expenses);

    const sortedExpenses = [...expenses].sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    );

    return {
      statistics: [
        { label: "Total Expenses", value: stats.totalCount },
        { label: "Total Amount", value: formatAmount(stats.totalAmount) },
        { label: "Pending", value: stats.statusBreakdown.PENDING.count },
        { label: "In Review", value: stats.statusBreakdown.IN_REVIEW.count },
        { label: "Approved", value: stats.statusBreakdown.APPROVED.count },
        { label: "Rejected", value: stats.statusBreakdown.REJECTED.count },
      ],
      recentExpenses: sortedExpenses.slice(0, recentExpensesLimit),
    };
  }, [expenses]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Overview of your expense approval activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/expenses", { state: { openCreateForm: true } })}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Expense
          </button>
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View Expenses
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statistics.map((statistic) => (
          <div key={statistic.label} className="rounded-lg border bg-white p-6">
            <p className="text-sm text-gray-500">{statistic.label}</p>
            <p className="mt-2 text-3xl font-bold">{statistic.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your most recent expense activity.
          </p>
        </div>

        {isLoading && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-gray-500">Loading dashboard data...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && expenses.length === 0 && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold">No expenses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first expense to get started.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && recentExpenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Submitted By</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b last:border-0">
                    <td className="px-6 py-4">{expense.description}</td>
                    <td className="px-6 py-4">{formatAmount(expense.amount)}</td>
                    <td className="px-6 py-4">{expense.submittedBy}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[expense.status]}`}
                      >
                        {statusLabels[expense.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(expense.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
