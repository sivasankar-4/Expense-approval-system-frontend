import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { canApproveExpenses } from "@/services/auth/authService";
import { expenseService } from "@/services/expense/expenseService";
import type { Expense, ExpenseStatus } from "@/types/expense";

const actionableStatuses: ExpenseStatus[] = ["PENDING", "IN_REVIEW"];

const isActionable = (status: ExpenseStatus) => actionableStatuses.includes(status);

const getErrorMessage = (error: unknown, action: "load" | "approve" | "reject") => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You do not have permission to manage approvals.";
      case 409:
        return "This expense has already been updated. Refresh the page and try again.";
      case 500:
        return "The server could not process your request. Please try again later.";
      default:
        return action === "load"
          ? "Unable to load approvals. Please try again."
          : `Unable to ${action} this expense. Please try again.`;
    }
  }

  return action === "load"
    ? "Unable to load approvals. Please try again."
    : `Unable to ${action} this expense. Please try again.`;
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(amount);

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime())
    ? createdAt
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
};

const ApprovalsPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingExpenseId, setUpdatingExpenseId] = useState<number | null>(null);
  const hasApprovalAccess = canApproveExpenses();

  useEffect(() => {
    let isMounted = true;

    const fetchApprovals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allExpenses = await expenseService.getAllExpenses();

        if (isMounted) {
          setExpenses(allExpenses.filter((expense) => isActionable(expense.status)));
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getErrorMessage(requestError, "load"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchApprovals();

    return () => {
      isMounted = false;
    };
  }, []);

  const approvals = useMemo(
    () => [...expenses].sort(
      (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    ),
    [expenses],
  );

  const handleAction = async (expense: Expense, action: "approve" | "reject") => {
    if (!hasApprovalAccess || updatingExpenseId !== null || !isActionable(expense.status)) {
      return;
    }

    if (action === "reject" && !window.confirm("Reject this expense? This action cannot be undone.")) {
      return;
    }

    try {
      setUpdatingExpenseId(expense.id);
      setError(null);
      const updatedExpense = action === "approve"
        ? await expenseService.approveExpense(expense.id)
        : await expenseService.rejectExpense(expense.id);

      setExpenses((currentExpenses) =>
        isActionable(updatedExpense.status)
          ? currentExpenses.map((currentExpense) =>
              currentExpense.id === updatedExpense.id ? updatedExpense : currentExpense,
            )
          : currentExpenses.filter((currentExpense) => currentExpense.id !== updatedExpense.id),
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError, action));
    } finally {
      setUpdatingExpenseId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review expense submissions that are awaiting a decision.
        </p>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review expense details before making an approval decision.
          </p>
        </div>

        {isLoading && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-gray-500">Loading approvals...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-red-500" role="alert">{error}</p>
          </div>
        )}

        {!isLoading && !error && approvals.length === 0 && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-gray-500">No pending approvals.</p>
          </div>
        )}

        {!isLoading && !error && approvals.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Submitted By</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((expense) => {
                  const isUpdating = updatingExpenseId === expense.id;

                  return (
                    <tr key={expense.id} className="border-b last:border-0">
                      <td className="px-6 py-4">{expense.description}</td>
                      <td className="px-6 py-4">{formatAmount(expense.amount)}</td>
                      <td className="px-6 py-4">{expense.submittedBy}</td>
                      <td className="px-6 py-4">{expense.status}</td>
                      <td className="px-6 py-4">{formatDate(expense.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/expenses/${expense.id}`)}
                            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                          >
                            View details
                          </button>
                          {hasApprovalAccess && (
                            <>
                              <button
                                type="button"
                                disabled={updatingExpenseId !== null}
                                onClick={() => handleAction(expense, "approve")}
                                className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating ? "Updating..." : "Approve"}
                              </button>
                              <button
                                type="button"
                                disabled={updatingExpenseId !== null}
                                onClick={() => handleAction(expense, "reject")}
                                className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating ? "Updating..." : "Reject"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
