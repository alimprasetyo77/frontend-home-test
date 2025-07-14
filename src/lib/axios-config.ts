import axios from "axios";
import { getCookie } from "cookies-next";

const bearerToken = getCookie("token") ?? "";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((axiosConfig) => {
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;
  return axiosConfig;
});

export default api;
