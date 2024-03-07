import axios from "axios";
import Environment from "./base";

export const apiClient = axios.create({
  baseURL: Environment.SERVER_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(Environment.STORAGE.ACCESS_TOKEN);
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Type': config.headers["Content-Type"] || "application/json"
  };
  for (const key in headers) {
    config.headers[key] = (headers as any)[key];
  }
  return config;
});