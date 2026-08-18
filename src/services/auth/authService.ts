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

export interface UserClaims {
  email?: string;
  sub?: string;
  name?: string;
  fullName?: string;
  tenantName?: string;
  tenantId?: string | number;
  roles: string[];
  issuedAt?: string;
  expiresAt?: string;
}

export const getAuthUserClaims = (): UserClaims | null => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const claims = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as Record<string, unknown>;

    if (!claims || typeof claims !== "object") return null;

    const roles = getAccessTokenRoles();
    const email =
      typeof claims.sub === "string" && claims.sub.includes("@")
        ? claims.sub
        : typeof claims.email === "string"
        ? claims.email
        : undefined;

    const rawName =
      typeof claims.name === "string"
        ? claims.name
        : typeof claims.fullName === "string"
        ? claims.fullName
        : email
        ? email.split("@")[0]
        : undefined;

    const tenantName =
      typeof claims.tenantName === "string"
        ? claims.tenantName
        : typeof claims.tenant === "string"
        ? claims.tenant
        : typeof claims.organization === "string"
        ? claims.organization
        : undefined;

    const tenantId =
      typeof claims.tenantId === "string" || typeof claims.tenantId === "number"
        ? claims.tenantId
        : undefined;

    const formatDateVal = (timestamp: unknown): string | undefined => {
      if (typeof timestamp === "number") {
        return new Date(timestamp * 1000).toLocaleString();
      }
      return undefined;
    };

    return {
      email,
      sub: typeof claims.sub === "string" ? claims.sub : undefined,
      name: rawName,
      fullName: rawName,
      tenantName,
      tenantId,
      roles,
      issuedAt: formatDateVal(claims.iat),
      expiresAt: formatDateVal(claims.exp),
    };
  } catch {
    return null;
  }
};

