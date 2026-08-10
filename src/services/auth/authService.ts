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
