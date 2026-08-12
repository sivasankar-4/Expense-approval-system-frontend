const DashboardPage = () => {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Overview of your expense approval activity.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <p className="mt-2 text-3xl font-bold">
            24
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold">
            8
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold">
            12
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-bold">
            4
          </p>
        </div>

      </div>

      {/* Recent Expenses */}
      <div className="rounded-lg border bg-white">

        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">
            Recent Expenses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your most recent expense activity.
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500">
            Recent expenses will appear here.
          </p>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;