// src/api/client.js
import axios from "axios";
import {
  getRefreshToken,
  saveAccessToken,
  getAccessToken,
  clearAllTokens,
} from "../utils/auth.js";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // IMPORTANT: allow cookies / refresh token
});

// Attach access token
api.interceptors.request.use((cfg) => {
  const t = getAccessToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// Refresh logic
let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalReq = err.config;
    if (!originalReq) return Promise.reject(err);

    const status = err?.response?.status;

    // If 401 and not already retrying
    if (status === 401 && !originalReq._retry && !originalReq.url?.includes("/auth/refresh")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalReq.headers.Authorization = `Bearer ${token}`;
            return api(originalReq);
          })
          .catch((e) => Promise.reject(e));
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const resp = await axios.post(
          `${BASE}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        const newAccess =
          resp.data.access_token ||
          resp.data.token ||
          resp.data.access ||
          resp.data.accessToken;

        if (!newAccess) throw new Error("Refresh response missing token");

        saveAccessToken(newAccess, true);
        processQueue(null, newAccess);

        originalReq.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAllTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
