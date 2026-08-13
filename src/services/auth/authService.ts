import api from "@/services/api/axios";

import type {
  LoginFormData,
} from "@/schemas/auth.schema";

import type {
  LoginResponse,
} from "@/types/auth";

export const login = async (
  credentials: LoginFormData
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/api/auth/login",
    credentials
  );

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenType");
};

const approvalRoles = new Set(["MANAGER", "FINANCE_ADMIN"]);

export const getAccessTokenRoles = (): string[] => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return [];
  }

  try {
    const payload = accessToken.split(".")[1];

    if (!payload) {
      return [];
    }

    const claims: unknown = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    if (!claims || typeof claims !== "object") {
      return [];
    }

    const roleClaims = [
      (claims as Record<string, unknown>).role,
      (claims as Record<string, unknown>).roles,
      (claims as Record<string, unknown>).authority,
      (claims as Record<string, unknown>).authorities,
    ];

    return roleClaims.flatMap((roleClaim) => {
      if (Array.isArray(roleClaim)) {
        return roleClaim.filter((role): role is string => typeof role === "string");
      }

      return typeof roleClaim === "string" ? roleClaim.split(/[\s,]+/) : [];
    });
  } catch {
    return [];
  }
};

export const canApproveExpenses = (): boolean =>
  getAccessTokenRoles().some((role) =>
    approvalRoles.has(role.replace(/^ROLE_/, "").toUpperCase()),
  );
