import api from "@/lib/axios-config";
import { ILoginResponse, IRegisterResponse, IUser, LoginType, RegisterType } from "@/types/auth-type";

export const login = async (body: LoginType) => {
  try {
    const response = await api.post("/auth/login", body);
    return response.data as ILoginResponse;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const register = async (body: RegisterType) => {
  try {
    const response = await api.post("/auth/register", body);
    return response.data as IRegisterResponse;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data as IUser;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
