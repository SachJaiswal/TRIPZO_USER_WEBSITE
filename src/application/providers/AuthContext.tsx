"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthState,
} from "../../domain/auth/auth.types";
import { authApi } from "../../infrastructure/api/authApi";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  googleLogin: (credential: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "tripzo_user_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const res = await authApi.getCurrentUser();
        if (res.success && res.data) {
          if (res.data.is_active) {
            setUser(res.data);
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      const response = await authApi.login(credentials);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Authentication failed");
      }

      const { token: newToken, user: authUser } = response.data;

      if (!authUser.is_active) {
        const error: any = new Error("Your account is currently inactive. Please contact support.");
        error.code = "ACCOUNT_INACTIVE";
        throw error;
      }

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(authUser);
      return authUser;
    } catch (error: any) {
      if (error.response?.data) {
        const serverErr = error.response.data;
        if (serverErr.error?.code === "ACCOUNT_INACTIVE" || serverErr.status === 403) {
          const customErr: any = new Error("Your account is currently inactive.");
          customErr.code = "ACCOUNT_INACTIVE";
          throw customErr;
        }
        if (serverErr.error?.code === "INVALID_CREDENTIALS" || serverErr.status === 401) {
          const customErr: any = new Error("Invalid email or password.");
          customErr.code = "INVALID_CREDENTIALS";
          throw customErr;
        }
        throw new Error(serverErr.message || "Unable to sign in. Please try again.");
      }
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<User> => {
    try {
      const response = await authApi.register(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Registration failed");
      }

      const { token: newToken, user: authUser } = response.data;

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(authUser);
      return authUser;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Registration failed. Email may already exist.");
      }
      throw error;
    }
  };

  const googleLogin = async (credential: string): Promise<User> => {
    try {
      const response = await authApi.googleAuth(credential);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Google Authentication failed");
      }

      const { token: newToken, user: authUser } = response.data;

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(authUser);
      return authUser;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Google Sign In failed.");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
