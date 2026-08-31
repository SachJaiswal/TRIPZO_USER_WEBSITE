import axiosClient from "./axiosClient";
import {
  AuthApiResponse,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
  User,
} from "../../domain/auth/auth.types";

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthApiResponse> {
    const response = await axiosClient.post<AuthApiResponse>(
      "/api/v1/auth/login",
      credentials
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthApiResponse> {
    const response = await axiosClient.post<AuthApiResponse>(
      "/api/v1/auth/register",
      data
    );
    return response.data;
  },

  async googleAuth(credential: string): Promise<AuthApiResponse> {
    const response = await axiosClient.post<AuthApiResponse>(
      "/api/v1/auth/google",
      { credential }
    );
    return response.data;
  },

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    const response = await axiosClient.get<{ success: boolean; data: User }>(
      "/api/v1/auth/me"
    );
    return response.data;
  },
};
