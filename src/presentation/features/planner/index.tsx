"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UserAppLayout } from "../../components/layouts/UserAppLayout";
import { useTripPlanner } from "../../../application/hooks/useTripPlanner";
import { TripWizardModal } from "../../components/trip/TripWizardModal";
import { TripGenerationProgress } from "../../components/trip/TripGenerationProgress";
import { TripDetailsView } from "../../components/trip/TripDetailsView";
import { Compass, Sparkles, MapPin, AlertCircle } from "lucide-react";
import "./style.css";

export const PlannerFeature: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const destinationParam = searchParams.get("destination");
  const daysParam = parseInt(searchParams.get("days") || "3", 10);
  const tripIdParam = searchParams.get("tripId");

  const {
    preferences,
    setPreferences,
    currentTrip,
    isWizardOpen,
    openWizard,
    closeWizard,
    isGenerating,
    isCustomizing,
    isRegenerating,
    progressStep,
    error,
    setError,
    usage,
    fetchUsage,
    generateTrip,
    loadTripDetails,
    customizeItinerary,
    regenerateItinerary,
  } = useTripPlanner();

  // Load existing trip if tripId is in URL, or prefill destination if provided
  useEffect(() => {
    fetchUsage();

    if (tripIdParam) {
      loadTripDetails(tripIdParam);
    } else if (destinationParam) {
      setPreferences((prev) => {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + (daysParam || 3));
        return {
          ...prev,
          destination: destinationParam,
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        };
      });
      openWizard(destinationParam);
    }
  }, [destinationParam, daysParam, tripIdParam, loadTripDetails, openWizard, setPreferences, fetchUsage]);

  const handleStartNewWizard = () => {
    openWizard();
  };

  return (
    <UserAppLayout>
      <div className="planner-page-root">
        {/* Error Alert Notification */}
        {error && (
          <div className="planner-error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="planner-error-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Generating State: Real Progress Steps */}
        {isGenerating && progressStep !== "idle" && !currentTrip && (
          <TripGenerationProgress
            step={progressStep}
            destination={preferences.destination || "Selected Location"}
          />
        )}

        {/* 2. Generated Trip Result View */}
        {currentTrip && !isGenerating && (
          <TripDetailsView
            trip={currentTrip}
            onCustomize={async (instruction) => {
              await customizeItinerary(currentTrip.trip_id, instruction);
            }}
            onRegenerate={async () => {
              await regenerateItinerary(currentTrip.trip_id);
            }}
            onPlanNewTrip={handleStartNewWizard}
            isCustomizing={isCustomizing}
            isRegenerating={isRegenerating}
            usageInfo={
              usage
                ? {
                    generationsCount: usage.generations_count,
                    maxAllowed: usage.max_allowed,
                  }
                : null
            }
          />
        )}

        {/* 3. Empty State (No trip generated yet & not generating) */}
        {!currentTrip && !isGenerating && (
          <div className="planner-empty-state">
            <div className="planner-empty-icon-halo">
              <Compass size={48} className="planner-empty-icon" />
            </div>

            <h2>AI Travel Studio</h2>
            <p>
              Specify your destination, dates, budget, and travel preferences. Our
              system verifies real-world places via Google Maps APIs and generates
              a tailored day-by-day itinerary.
            </p>

            <button
              type="button"
              onClick={handleStartNewWizard}
              className="planner-start-btn"
            >
              <Sparkles size={20} />
              <span>Create a New Travel Plan</span>
            </button>

            {usage && (
              <div className="planner-quota-notice">
                Generation Quota: <strong>{usage.generations_count} / {usage.max_allowed}</strong> trips created
              </div>
            )}
          </div>
        )}

        {/* Multi-step Trip Creation Wizard */}
        <TripWizardModal
          isOpen={isWizardOpen}
          onClose={closeWizard}
          onSubmit={async (newPrefs) => {
            await generateTrip(newPrefs);
          }}
          initialPreferences={preferences}
          isGenerating={isGenerating}
        />
      </div>
    </UserAppLayout>
  );
};

export default PlannerFeature;
