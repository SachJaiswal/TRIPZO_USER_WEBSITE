export type UserRole = "ADMIN" | "USER";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface User {
  user_generated_id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: UserRole;
  auth_provider: AuthProvider;
  profile_picture?: string;
  is_email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone_number?: string;
  password: string;
}

export interface GoogleAuthRequest {
  credential: string;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  error?: {
    code: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
