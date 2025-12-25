import axios from "axios";
import { API_URL } from "../config";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

(async () => {
  try {
    const hasUser = Boolean(localStorage.getItem("user"));
    const hasToken = Boolean(localStorage.getItem("token"));
    if (hasUser && !hasToken) {
      const res = await axios.get(`${API_URL}/auth/token`);
      if (res?.data?.token) localStorage.setItem("token", res.data.token);
    }
  } catch {
    // ignore: fallback to cookies if available
  }
})();
