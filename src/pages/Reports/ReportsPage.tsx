import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { expenseService } from "@/services/expense/expenseService";
import type { Expense } from "@/types/expense";
import {
  calculateExpenseStats,
  formatAmount,
  formatDate,
  statusClasses,
  statusLabels,
} from "@/utils/expenseUtils";

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You do not have permission to view reports.";
      case 500:
        return "The server could not process your request. Please try again later.";
      default:
        return "Unable to load report data. Please try again.";
    }
  }
  return "Unable to load report data. Please try again.";
};

const ReportsPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await expenseService.getAllExpenses();
        if (isMounted) {
          setExpenses(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReportData();

    return () => {
      isMounted = false;
    };
  }, []);

  const { stats, recentExpenses } = useMemo(() => {
    const calculatedStats = calculateExpenseStats(expenses);
    const sorted = [...expenses].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      stats: calculatedStats,
      recentExpenses: sorted.slice(0, 10),
    };
  }, [expenses]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="mt-2 text-sm text-gray-500">
            Financial summary and status breakdown of organization expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 self-start"
        >
          View All Expenses
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Loading expense report data...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-red-600" role="alert">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && expenses.length === 0 && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white p-6">
          <div className="text-center">
            <h3 className="text-base font-semibold">No expense data available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no expenses submitted in the system to generate reports.
            </p>
          </div>
        </div>
      )}

      {/* Report Dashboard Content */}
      {!isLoading && !error && expenses.length > 0 && (
        <>
          {/* Summary Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalCount}</p>
              <p className="mt-1 text-xs text-gray-400">Total submitted records</p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">Total Expense Amount</p>
              <p className="mt-2 text-3xl font-bold">{formatAmount(stats.totalAmount)}</p>
              <p className="mt-1 text-xs text-gray-400">Cumulative monetary value</p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">Approved Amount</p>
              <p className="mt-2 text-3xl font-bold">
                {formatAmount(stats.statusBreakdown.APPROVED.amount)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {stats.statusBreakdown.APPROVED.count} expense(s) approved (
                {stats.statusBreakdown.APPROVED.amountPercentage}% of total)
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="mt-2 text-3xl font-bold">
                {formatAmount(stats.statusBreakdown.PENDING.amount)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {stats.statusBreakdown.PENDING.count} expense(s) pending decision
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">In Review</p>
              <p className="mt-2 text-3xl font-bold">
                {formatAmount(stats.statusBreakdown.IN_REVIEW.amount)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {stats.statusBreakdown.IN_REVIEW.count} expense(s) under review
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
              <p className="text-sm font-medium text-gray-500">Rejected Amount</p>
              <p className="mt-2 text-3xl font-bold">
                {formatAmount(stats.statusBreakdown.REJECTED.amount)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {stats.statusBreakdown.REJECTED.count} expense(s) rejected
              </p>
            </div>
          </div>

          {/* Status Breakdown Section */}
          <div className="rounded-lg border bg-white">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold">Expense Status Breakdown</h2>
              <p className="mt-1 text-sm text-gray-500">
                Detailed metrics by expense approval state.
              </p>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Count</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Count %</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Total Amount</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Amount %</th>
                      <th className="px-4 py-3 font-medium text-gray-600 w-1/4">Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.statusList.map((item) => (
                      <tr key={item.status} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[item.status]}`}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{item.count}</td>
                        <td className="px-4 py-3 text-gray-500">{item.countPercentage}%</td>
                        <td className="px-4 py-3 font-medium">{formatAmount(item.amount)}</td>
                        <td className="px-4 py-3 text-gray-500">{item.amountPercentage}%</td>
                        <td className="px-4 py-3">
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-black h-2 rounded-full"
                              style={{ width: `${item.amountPercentage}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Category Notice */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Note: </span>
            Category breakdown is omitted because the current backend response model (`Expense`) does not include a `category` field.
          </div>

          {/* Recent Expenses Table */}
          <div className="rounded-lg border bg-white">
            <div className="border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Recent Expense Activity</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Top 10 recent submissions included in this report.
                </p>
              </div>
            </div>

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
                    <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium">{expense.description}</td>
                      <td className="px-6 py-4">{formatAmount(expense.amount)}</td>
                      <td className="px-6 py-4 text-gray-600">{expense.submittedBy}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[expense.status]}`}
                        >
                          {statusLabels[expense.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(expense.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;