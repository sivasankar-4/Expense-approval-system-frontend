import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

import { userService } from "@/services/user/userService";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/expenseUtils";

const roleBadgeClasses: Record<string, string> = {
  FINANCE_ADMIN: "bg-black text-white",
  MANAGER: "bg-gray-200 text-gray-800 border border-gray-400",
  EMPLOYEE: "bg-gray-100 text-gray-700 border border-gray-300",
};

const roleLabels: Record<string, string> = {
  FINANCE_ADMIN: "Finance Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You do not have permission to access user administration.";
      case 404:
        return "User management endpoint was not found on the server.";
      case 500:
        return "The server could not process your user request. Please try again later.";
      default:
        return "Unable to load user list. Please try again.";
    }
  }
  return "Unable to load user list. Please try again.";
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getUsers();
        if (isMounted) {
          setUsers(data);
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

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Administration</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage organization team members and access control roles.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Loading organization users...</p>
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
      {!isLoading && !error && users.length === 0 && (
        <div className="flex min-h-64 items-center justify-center rounded-lg border bg-white p-6">
          <div className="text-center">
            <h3 className="text-base font-semibold">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no user accounts associated with your tenant organization.
            </p>
          </div>
        </div>
      )}

      {/* User Table & Details */}
      {!isLoading && !error && users.length > 0 && (
        <>
          <div className="rounded-lg border bg-white">
            <div className="border-b p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">Team Members ({users.length})</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Users registered under your organization tenant.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-600">User / Name</th>
                    <th className="px-6 py-4 font-medium text-gray-600">Email</th>
                    <th className="px-6 py-4 font-medium text-gray-600">Role</th>
                    {users.some((u) => u.status) && (
                      <th className="px-6 py-4 font-medium text-gray-600">Status</th>
                    )}
                    {users.some((u) => u.tenantName) && (
                      <th className="px-6 py-4 font-medium text-gray-600">Tenant</th>
                    )}
                    {users.some((u) => u.createdAt) && (
                      <th className="px-6 py-4 font-medium text-gray-600">Created At</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const displayName = user.fullName || user.name || user.email.split("@")[0];
                    const roleKey = String(user.role).replace(/^ROLE_/, "").toUpperCase();
                    const badgeClass = roleBadgeClasses[roleKey] || "bg-gray-100 text-gray-700";
                    const roleLabel = roleLabels[roleKey] || roleKey;

                    return (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">{displayName}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
                          >
                            {roleLabel}
                          </span>
                        </td>
                        {users.some((u) => u.status) && (
                          <td className="px-6 py-4 text-gray-600">{user.status || "Active"}</td>
                        )}
                        {users.some((u) => u.tenantName) && (
                          <td className="px-6 py-4 text-gray-600">{user.tenantName}</td>
                        )}
                        {users.some((u) => u.createdAt) && (
                          <td className="px-6 py-4 text-gray-500">
                            {user.createdAt ? formatDate(user.createdAt) : "—"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Note: </span>
            User management actions (Create / Edit / Deactivate User) are not enabled because the backend REST API currently only exposes a read-only user listing endpoint (`GET /users`).
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;