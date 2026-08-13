import type { Role } from "@/constants/roles";

export interface User {
  id: number;
  email: string;
  name?: string;
  fullName?: string;
  role: Role | string;
  status?: string;
  tenantName?: string;
  createdAt?: string;
}
