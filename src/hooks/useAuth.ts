import { getAccessTokenRoles } from "@/services/auth/authService";
import { ROLES } from "@/constants/roles";

/**
 * Hook to expose authentication state derived from the stored JWT.
 * The backend is the source of truth – we simply decode the token locally
 * to obtain role claims (no client‑side trust for security).
 */
export const useAuth = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Compute role set – fallback to empty array if token missing/invalid.
  const tokenRoles = getAccessTokenRoles();

  // Determine the highest‑privilege role present.
  const role = (() => {
    if (tokenRoles.includes(ROLES.FINANCE_ADMIN)) return ROLES.FINANCE_ADMIN;
    if (tokenRoles.includes(ROLES.MANAGER)) return ROLES.MANAGER;
    if (tokenRoles.includes(ROLES.EMPLOYEE)) return ROLES.EMPLOYEE;
    return undefined;
  })();

  return { isAuthenticated, role, tokenRoles };
};
