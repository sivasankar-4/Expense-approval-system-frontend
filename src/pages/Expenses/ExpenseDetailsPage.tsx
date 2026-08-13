import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { expenseService } from "@/services/expense/expenseService";
import { canApproveExpenses } from "@/services/auth/authService";
import type { Expense } from "@/types/expense";

const getErrorMessage = (error: unknown, action: string) => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return `You do not have permission to ${action} this expense.`;
      case 404:
        return "This expense could not be found.";
      case 409:
        return "This expense has already been updated. Refresh the page and try again.";
      case 500:
        return "The server could not process your request. Please try again later.";
      default:
        return `Unable to ${action} this expense. Please try again.`;
    }
  }

  return `Unable to ${action} this expense. Please try again.`;
};

const ExpenseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const expenseId = Number(id);
  const hasValidId = Boolean(id) && Number.isInteger(expenseId) && expenseId > 0;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(hasValidId);
  const [error, setError] = useState<string | null>(
    hasValidId ? null : "The expense ID is invalid.",
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const hasApprovalAccess = canApproveExpenses();

  useEffect(() => {
    if (!hasValidId) {
      return;
    }

    const fetchExpense = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setExpense(null);
        setExpense(await expenseService.getExpenseById(expenseId));
      } catch (requestError) {
        console.error("Failed to fetch expense:", requestError);
        setExpense(null);
        setError(getErrorMessage(requestError, "load"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId, hasValidId]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!expense || isUpdating || expense.status === "APPROVED" || expense.status === "REJECTED") {
      return;
    }

    if (!hasApprovalAccess) {
      return;
    }

    if (action === "reject" && !window.confirm("Reject this expense? This action cannot be undone.")) {
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      const updatedExpense = action === "approve"
        ? await expenseService.approveExpense(expense.id)
        : await expenseService.rejectExpense(expense.id);

      setExpense(updatedExpense);
    } catch (requestError) {
      console.error(`Failed to ${action} expense:`, requestError);
      setError(getErrorMessage(requestError, action));
    } finally {
      setIsUpdating(false);
    }
  };

  const canTakeAction = hasApprovalAccess && (expense?.status === "PENDING" || expense?.status === "IN_REVIEW");

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Details</h1>
          <p className="mt-2 text-sm text-gray-500">Review the submitted expense and its current status.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Back to Expenses
        </button>
      </div>

      {isLoading && (
        <div className="flex min-h-48 items-center justify-center rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Loading expense details...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-white p-6">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && expense && (
        <div className="rounded-lg border bg-white">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">{expense.description}</h2>
            <p className="mt-1 text-sm text-gray-500">Expense #{expense.id}</p>
          </div>

          <dl className="grid gap-6 p-6 sm:grid-cols-2">
            <div><dt className="text-sm text-gray-500">Amount</dt><dd className="mt-1 font-medium">{expense.amount}</dd></div>
            <div><dt className="text-sm text-gray-500">Status</dt><dd className="mt-1 font-medium">{expense.status}</dd></div>
            <div><dt className="text-sm text-gray-500">Submitted By</dt><dd className="mt-1 font-medium">{expense.submittedBy}</dd></div>
            <div><dt className="text-sm text-gray-500">Tenant</dt><dd className="mt-1 font-medium">{expense.tenantName}</dd></div>
            <div><dt className="text-sm text-gray-500">Created At</dt><dd className="mt-1 font-medium">{expense.createdAt}</dd></div>
          </dl>

          {canTakeAction && (
            <div className="flex flex-wrap gap-3 border-t p-6">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleAction("approve")}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Approve"}
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleAction("reject")}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Reject"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseDetailsPage;
