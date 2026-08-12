export type ExpenseStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface Expense {
  id: number;
  submittedBy: string;
  amount: number;
  description: string;
  status: ExpenseStatus;
  tenantName: string;
  createdAt: string;
}