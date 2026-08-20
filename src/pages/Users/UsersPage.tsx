import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { userService } from "@/services/user/userService";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/expenseUtils";

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
  const navigate = useNavigate();
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

  const darkSlateCardStyle = {
    background: "#14171F",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F6F5]">
          User Administration
        </h1>
        <p className="mt-2 text-sm text-[#A1A1A4]">
          Manage organization team members and access control roles.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          className="flex min-h-64 items-center justify-center p-6 shadow-xl"
          style={darkSlateCardStyle}
        >
          <p className="text-sm text-[#A1A1A4]">Loading organization users...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div
          className="p-6 text-center shadow-xl"
          style={darkSlateCardStyle}
        >
          <p className="text-sm font-medium text-red-400" role="alert">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && users.length === 0 && (
        <div
          className="flex min-h-64 items-center justify-center p-6 shadow-xl"
          style={darkSlateCardStyle}
        >
          <div className="text-center">
            <h3 className="text-base font-bold text-[#F5F6F5]">No users found</h3>
            <p className="mt-1 text-sm text-[#A1A1A4]">
              There are currently no user accounts associated with your tenant organization.
            </p>
          </div>
        </div>
      )}

      {/* User Table & Details */}
      {!isLoading && !error && users.length > 0 && (
        <>
          <div
            className="overflow-hidden shadow-xl"
            style={darkSlateCardStyle}
          >
            <div className="border-b border-white/[0.08] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[#F5F6F5]">
                  Team Members ({users.length})
                </h2>
                <p className="mt-1 text-sm text-[#A1A1A4]">
                  Users registered under your organization tenant.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/[0.08] text-[#F5F6F5]">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[#F5F6F5]">User / Name</th>
                    <th className="px-6 py-4 font-bold text-[#F5F6F5]">Email</th>
                    <th className="px-6 py-4 font-bold text-[#F5F6F5]">Role</th>
                    {users.some((u) => u.status) && (
                      <th className="px-6 py-4 font-bold text-[#F5F6F5]">Status</th>
                    )}
                    {users.some((u) => u.tenantName) && (
                      <th className="px-6 py-4 font-bold text-[#F5F6F5]">Tenant</th>
                    )}
                    {users.some((u) => u.createdAt) && (
                      <th className="px-6 py-4 font-bold text-[#F5F6F5]">Created At</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.08]">
                  {users.map((user) => {
                    const displayName = user.fullName || user.name || user.email.split("@")[0];
                    const roleKey = String(user.role).replace(/^ROLE_/, "").toUpperCase();
                    const roleLabel = roleLabels[roleKey] || roleKey;

                    return (
                      <tr key={user.id} className="border-b border-white/[0.08] last:border-0 hover:bg-white/[0.03] transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#F5F6F5]">{displayName}</td>
                        <td className="px-6 py-4 font-medium text-[#F5F6F5]">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-white/10 text-white border border-white/15 px-3 py-1 text-xs font-semibold">
                            {roleLabel}
                          </span>
                        </td>
                        {users.some((u) => u.status) && (
                          <td className="px-6 py-4 text-[#F5F6F5]">{user.status || "Active"}</td>
                        )}
                        {users.some((u) => u.tenantName) && (
                          <td className="px-6 py-4 text-[#F5F6F5]">{user.tenantName}</td>
                        )}
                        {users.some((u) => u.createdAt) && (
                          <td className="px-6 py-4 text-[#A1A1A4]">
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

          <div
            className="p-4 text-xs rounded-r-xl"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderLeft: "3px solid #B13A29",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#A1A1A4",
            }}
          >
            <span className="font-bold text-[#F5F6F5]">Note: </span>
            User management actions (Create / Edit / Deactivate User) are not enabled because the backend REST API currently only exposes a read-only user listing endpoint (`GET /users`).
          </div>
        </>
      )}
    </div>
  );
};

export default UsersPage;