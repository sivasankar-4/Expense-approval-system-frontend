import { useEffect, useState } from "react";

import { expenseService } from "@/services/expense/expenseService";
import type { Expense } from "@/types/expense";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await expenseService.getAllExpenses();

        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
        setError("Unable to load expenses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Expenses
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage and track your expense submissions.
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + New Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Expense List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and track your submitted expenses.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-gray-500">
              Loading expenses...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && expenses.length === 0 && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold">
                No expenses found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create your first expense to get started.
              </p>
            </div>
          </div>
        )}

        {/* Expenses */}
        {!isLoading && !error && expenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Description
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Amount
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Submitted By
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4">
                      {expense.description}
                    </td>

                    <td className="px-6 py-4">
                      {expense.amount}
                    </td>

                    <td className="px-6 py-4">
                      {expense.submittedBy}
                    </td>

                    <td className="px-6 py-4">
                      {expense.status}
                    </td>

                    <td className="px-6 py-4">
                      {expense.createdAt}
                    </td>
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

export default ExpensesPage;