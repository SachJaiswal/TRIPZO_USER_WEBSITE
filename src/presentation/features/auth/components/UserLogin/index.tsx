"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../application/providers/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { Logo } from "../../../../components/branding/Logo";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { AlertCircle, Compass, Sparkles } from "lucide-react";
import "./style.css";

export const UserLogin: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, login, register, googleLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setNameError("");
    setServerError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (activeTab === "register" && !name.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    }

    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError("Please enter a valid email address.");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      if (activeTab === "login") {
        await login({
          email: email.trim().toLowerCase(),
          password,
        });
      } else {
        await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phone.trim() || undefined,
          password,
        });
      }
      router.push("/home");
    } catch (err: any) {
      setServerError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setServerError("Google did not return valid credentials.");
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      await googleLogin(credentialResponse.credential);
      router.push("/home");
    } catch (err: any) {
      setServerError(err.message || "Google Sign In verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="user-login-page user-login-page--loading">
        <div className="user-login-page__loader" />
      </div>
    );
  }

  return (
    <main className="user-login-page">
      <div className="user-login-page__wrapper">
        <header className="user-login-page__header">
          <Logo size="large" />
          <p className="user-login-page__tagline">
            <Sparkles className="user-login-page__sparkle-icon" />
            <span>AI-Powered Personal Travel Planner</span>
          </p>
        </header>

        <div className="user-login-page__card">
          {/* Tabs Toggle */}
          <div className="user-login-tabs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setServerError("");
              }}
              className={`user-login-tab ${activeTab === "login" ? "user-login-tab--active" : ""}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setServerError("");
              }}
              className={`user-login-tab ${activeTab === "register" ? "user-login-tab--active" : ""}`}
            >
              Create Account
            </button>
          </div>

          {/* Form Header Title */}
          <div className="user-login-card__title-box">
            <h1 className="user-login-card__title">
              {activeTab === "login" ? "Welcome back traveler!" : "Start planning your dream trip"}
            </h1>
            <p className="user-login-card__subtitle">
              {activeTab === "login"
                ? "Sign in to access your saved itineraries and AI travel plans."
                : "Create your free account to generate personalized travel itineraries."}
            </p>
          </div>

          {/* Real Google OAuth Button Component */}
          <div className="google-oauth-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setServerError("Google Sign In popup closed or failed.")}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="350"
            />
          </div>

          <div className="user-login-divider">
            <span>or sign in with email</span>
          </div>

          {/* Form Alert */}
          {serverError && (
            <div role="alert" className="user-login-alert">
              <AlertCircle className="user-login-alert__icon" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="user-login-form">
            {activeTab === "register" && (
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
                disabled={isSubmitting}
              />
            )}

            <Input
              label="Email address"
              type="email"
              name="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              disabled={isSubmitting}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              isLoading={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : activeTab === "login"
                ? "Sign In to Tripzo"
                : "Create Free Account"}
            </Button>
          </form>

          <footer className="user-login-card__footer">
            <Compass className="user-login-card__footer-icon" />
            <span>Ready for your next adventure</span>
          </footer>
        </div>
      </div>
    </main>
  );
};
