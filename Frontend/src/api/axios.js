import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401
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
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(
            "http://localhost:8082/auth/refresh",
            { refreshToken }
          );

          // Save new tokens
          sessionStorage.setItem("token", res.data.tokens.accessToken);
          sessionStorage.setItem("refreshToken", res.data.tokens.refreshToken);

          // Retry original request
          originalRequest.headers["Authorization"] = `Bearer ${res.data.tokens.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          // Refresh failed → logout
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
          window.location.href = "/";
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
