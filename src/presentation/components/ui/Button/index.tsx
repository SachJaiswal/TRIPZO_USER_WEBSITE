import React from "react";
import { Loader2 } from "lucide-react";
import "./style.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`admin-btn admin-btn--${variant} admin-btn--${size} ${
        fullWidth ? "admin-btn--full" : ""
      } ${isLoading ? "admin-btn--loading" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="admin-btn__spinner-content">
          <Loader2 className="admin-btn__spinner" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
