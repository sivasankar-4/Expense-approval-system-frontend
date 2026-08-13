import api from "@/services/api/axios";
import type { User } from "@/types/user";

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      // Fallback try for /api/users if /users endpoint differs
      try {
        const response = await api.get<User[]>("/api/users");
        return response.data;
      } catch {
        throw error;
      }
    }
  },
};
