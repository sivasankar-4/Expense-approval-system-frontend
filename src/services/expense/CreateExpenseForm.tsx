import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createExpenseSchema,
  type CreateExpenseFormData,
} from "@/schemas/expense.schema";

import { expenseService } from "@/services/expense/expenseService";

const CreateExpenseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
  });

  const onSubmit = async (data: CreateExpenseFormData) => {
    try {
      const expense = await expenseService.createExpense(data);

      console.log("Expense created successfully:", expense);

      reset();
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-medium"
        >
          Amount
        </label>

        <input
          id="amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register("amount", {
            valueAsNumber: true,
          })}
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Currency */}
      <div>
        <label
          htmlFor="currency"
          className="mb-2 block text-sm font-medium"
        >
          Currency
        </label>

        <input
          id="currency"
          type="text"
          placeholder="e.g. Rupees"
          {...register("currency")}
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        {errors.currency && (
          <p className="mt-1 text-sm text-red-500">
            {errors.currency.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium"
        >
          Category
        </label>

        <input
          id="category"
          type="text"
          placeholder="e.g. IT"
          {...register("category")}
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        {errors.category && (
          <p className="mt-1 text-sm text-red-500">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="description"
          placeholder="Describe the expense"
          {...register("description")}
          className="min-h-24 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Expense"}
      </button>
    </form>
  );
};

export default CreateExpenseForm;