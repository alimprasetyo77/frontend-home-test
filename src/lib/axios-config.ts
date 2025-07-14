import axios from "axios";

let bearerToken = "";

export const setAxiosConfig = (token: string) => {
  bearerToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((axiosConfig) => {
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;
  return axiosConfig;
});

export default api;
