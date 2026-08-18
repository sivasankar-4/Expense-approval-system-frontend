import api from "@/services/api/axios";
import type { User } from "@/types/user";

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/api/users");
    return response.data;
  },
};