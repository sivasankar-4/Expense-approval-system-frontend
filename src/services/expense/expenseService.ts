import api from "@/services/api/axios";
import type { Expense } from "@/types/expense";


//here creating an object containing all expense-related api operations
export const expenseService = {
  async getAllExpenses(): Promise<Expense[]> {
    const response = await api.get<Expense[]>("/expenses");

    return response.data;
  },

  async getExpenseById(id: number): Promise<Expense> {
    const response = await api.get<Expense>(`/expenses/${id}`);

    return response.data;
  },
};