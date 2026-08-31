import React, { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./style.css";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  type = "text",
  disabled,
  id: customId,
  className = "",
  ...props
}) => {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`admin-input-group ${error ? "admin-input-group--error" : ""} ${className}`}>
      <label htmlFor={inputId} className="admin-input-group__label">
        {label}
      </label>

      <div className="admin-input-group__wrapper">
        <input
          id={inputId}
          type={actualType}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="admin-input-group__input"
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            tabIndex={0}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="admin-input-group__toggle-btn"
          >
            {showPassword ? (
              <EyeOff className="admin-input-group__toggle-icon" />
            ) : (
              <Eye className="admin-input-group__toggle-icon" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <span id={errorId} role="alert" className="admin-input-group__error">
          {error}
        </span>
      ) : helperText ? (
        <span className="admin-input-group__helper">{helperText}</span>
      ) : null}
    </div>
  );
};
