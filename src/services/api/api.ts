/**
 * DEPRECATED — This file is intentionally empty.
 *
 * Previously this held a second Axios instance with baseURL "/api" suffix,
 * which was never imported by any service and would have caused double-path
 * URLs (e.g. /api/api/...) if used accidentally.
 *
 * All API calls go through src/services/api/axios.ts (the single
 * centralized Axios instance with authentication interceptors).
 */
export {};