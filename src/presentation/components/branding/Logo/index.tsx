import React from "react";
import { Compass, Sparkles } from "lucide-react";
import "./style.css";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  return (
    <div className={`user-logo user-logo--${size}`}>
      <div className="user-logo__badge">
        <Compass className="user-logo__icon" />
      </div>
      <div className="user-logo__text">
        <span className="user-logo__brand">TRIPZO</span>
        <span className="user-logo__tagline">AI TRAVEL PLANNER</span>
      </div>
    </div>
  );
};
