"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "your-google-client-id.apps.googleusercontent.com";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
};
