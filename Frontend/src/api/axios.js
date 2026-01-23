import axios from "axios";

// Generic API instance
const api = axios.create({
  baseURL: "http://localhost:8082", // no /auth here
  headers: { "Content-Type": "application/json" },
});

// Automatically attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          // Use full URL for refresh token
          const res = await axios.post(
            "http://localhost:8082/auth/refresh",
            { refreshToken }
          );

          // Save new tokens
          localStorage.setItem("token", res.data.tokens.accessToken);
          localStorage.setItem("refreshToken", res.data.tokens.refreshToken);

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${res.data.tokens.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          // Refresh failed → logout
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
