"use client";

import React from "react";
import {
  Sparkles,
  MapPin,
  Building2,
  CloudSun,
  Calculator,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";
import { GenerationProgressStep } from "../../../application/hooks/useTripPlanner";
import "./TripGenerationProgress.css";

interface TripGenerationProgressProps {
  step: GenerationProgressStep;
  destination: string;
}

const STEPS = [
  {
    id: "geocoding",
    label: "Google Geocoding API",
    desc: "Resolving destination coordinates & region boundary",
    icon: MapPin,
  },
  {
    id: "places",
    label: "Google Places API",
    desc: "Fetching verified hotels, attractions, & dining spots",
    icon: Building2,
  },
  {
    id: "weather",
    label: "Weather API",
    desc: "Retrieving climate metrics & date-range temperature forecast",
    icon: CloudSun,
  },
  {
    id: "budget",
    label: "Financial Budget Engine",
    desc: "Calculating accommodation caps & daily expense allocations",
    icon: Calculator,
  },
  {
    id: "ai_reasoning",
    label: "OpenAI Travel Architect",
    desc: "Structuring day-by-day itinerary using candidate places",
    icon: BrainCircuit,
  },
];

export const TripGenerationProgress: React.FC<TripGenerationProgressProps> = ({
  step,
  destination,
}) => {
  const getStepStatus = (stepId: string) => {
    const order = ["geocoding", "places", "weather", "budget", "ai_reasoning"];
    const currentIndex = order.indexOf(step);
    const stepIndex = order.indexOf(stepId);

    if (currentIndex === -1) return "waiting";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "waiting";
  };

  return (
    <div className="gen-progress-card">
      <div className="gen-progress-header">
        <div className="gen-sparkle-halo">
          <Sparkles className="gen-sparkle-icon" size={28} />
        </div>
        <h2>Crafting Your Travel Plan for {destination}</h2>
        <p className="gen-subtitle">
          Connecting real-world Google Maps & Weather data with OpenAI reasoning.
        </p>
      </div>

      <div className="gen-steps-container">
        {STEPS.map((s) => {
          const status = getStepStatus(s.id);
          const Icon = s.icon;
          return (
            <div key={s.id} className={`gen-step-row ${status}`}>
              <div className="gen-step-icon-col">
                {status === "completed" ? (
                  <CheckCircle2 className="step-completed-icon" size={22} />
                ) : (
                  <div className="step-icon-box">
                    <Icon size={20} />
                  </div>
                )}
              </div>

              <div className="gen-step-text-col">
                <div className="gen-step-title-row">
                  <h4>{s.label}</h4>
                  {status === "active" && <span className="gen-badge-live">Live</span>}
                  {status === "completed" && (
                    <span className="gen-badge-done">Done</span>
                  )}
                </div>
                <p>{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gen-progress-bar-track">
        <div className="gen-progress-bar-fill" />
      </div>
    </div>
  );
};
