import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface QueueEntry {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// Extend config to carry the retry flag
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ── Refresh queue & lock ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: QueueEntry[] = [];

const processQueue = (error: unknown, token: string | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || token === null) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// ── Force logout helper ───────────────────────────────────────────────────────
// Lives outside React so interceptors can call it safely.
const forceLogout = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenType");
  // Hard redirect — interceptor lives outside the React component tree.
  window.location.href = "/login";
};

// ── Centralized Axios instance ────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8084",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST interceptor: attach current access token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE interceptor: handle 401 with queued token refresh ───────────────
api.interceptors.response.use(
  // Pass successful responses straight through.
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    // Only handle 401s on requests we haven't already retried,
    // and never retry the refresh endpoint itself (avoids infinite loop).
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // ── If a refresh is already in-flight, queue this request ────────────────
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          }
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // ── First 401: acquire the refresh lock ──────────────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // Nothing to refresh with — hard logout immediately.
      processQueue(new Error("No refresh token available"), null);
      isRefreshing = false;
      forceLogout();
      return Promise.reject(error);
    }

    try {
      // Use raw axios (not the `api` instance) to avoid hitting our own
      // response interceptor recursively on a refresh failure.
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8084";

      const { data } = await axios.post<{
        accessToken: string;
        refreshToken: string;
        tokenType?: string;
      }>(`${baseURL}/api/auth/refresh`, { refreshToken });

      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      // ── Store the rotated tokens ──────────────────────────────────────────
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      if (data.tokenType) {
        localStorage.setItem("tokenType", data.tokenType);
      }

      // Update the default Authorization header for subsequent requests.
      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

      // Resume all queued requests with the new token.
      processQueue(null, newAccessToken);

      // Retry the original request with the new token.
      if (originalRequest.headers) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      }
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh itself failed — reject all queued requests and log the user out.
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;