import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("electrodead_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("electrodead_token");
      localStorage.removeItem("electrodead_user");
    }

    return Promise.reject(error);
  }
);

export default api;
