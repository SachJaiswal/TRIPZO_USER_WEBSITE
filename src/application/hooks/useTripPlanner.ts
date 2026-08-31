"use client";

import { useState, useCallback } from "react";
import {
  TripPreferences,
  TripModel,
  TripUsage,
} from "../../domain/trip/trip.types";
import { tripApi } from "../../infrastructure/api/tripApi";

export type GenerationProgressStep =
  | "idle"
  | "geocoding"
  | "places"
  | "weather"
  | "budget"
  | "ai_reasoning"
  | "completed"
  | "error";

export const defaultPreferences: TripPreferences = {
  destination: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  adults: 2,
  children: 0,
  rooms: 1,
  totalBudget: 15000,
  currency: "INR",
  accommodationPreference: "resort",
  minHotelRating: 4.0,
  interests: ["nature", "food", "viewpoints", "culture"],
  travelStyle: "relaxed",
  transportationPreference: "rental_car",
};

export function useTripPlanner() {
  const [preferences, setPreferences] =
    useState<TripPreferences>(defaultPreferences);
  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [progressStep, setProgressStep] =
    useState<GenerationProgressStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<TripUsage | null>(null);

  const openWizard = useCallback((initialDestination?: string) => {
    setError(null);
    if (initialDestination) {
      setPreferences((prev) => ({
        ...prev,
        destination: initialDestination,
      }));
    }
    setIsWizardOpen(true);
  }, []);

  const closeWizard = useCallback(() => {
    setIsWizardOpen(false);
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await tripApi.getUserUsage();
      if (res.success && res.data) {
        setUsage(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch user quota:", err);
    }
  }, []);

  const generateTrip = useCallback(
    async (overridePrefs?: TripPreferences) => {
      const activePrefs = overridePrefs || preferences;

      if (!activePrefs.destination || !activePrefs.destination.trim()) {
        setError("Please specify a valid travel destination.");
        return;
      }

      setIsGenerating(true);
      setError(null);
      setProgressStep("geocoding");

      // Simulated step progression for smooth UX
      const stepTimer1 = setTimeout(() => setProgressStep("places"), 1200);
      const stepTimer2 = setTimeout(() => setProgressStep("weather"), 2800);
      const stepTimer3 = setTimeout(() => setProgressStep("budget"), 4200);
      const stepTimer4 = setTimeout(() => setProgressStep("ai_reasoning"), 5800);

      try {
        const response = await tripApi.generateTrip(activePrefs);
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
        clearTimeout(stepTimer4);

        if (response.success && response.data) {
          setProgressStep("completed");
          setCurrentTrip(response.data);
          setIsWizardOpen(false);

          if (response.usage) {
            setUsage((prev) => ({
              ...(prev || {
                user_generated_id: response.data.user_generated_id,
                generations_count: 0,
                max_allowed: 10,
                last_generated_at: new Date().toISOString(),
              }),
              generations_count: response.usage!.generationsCount,
              max_allowed: response.usage!.maxAllowed,
            }));
          }
        } else {
          throw new Error(response.message || "Failed to generate trip plan.");
        }
      } catch (err: any) {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
        clearTimeout(stepTimer4);

        setProgressStep("error");
        const msg =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while generating your travel plan.";
        setError(msg);
      } finally {
        setIsGenerating(false);
      }
    },
    [preferences]
  );

  const loadTripDetails = useCallback(async (tripId: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await tripApi.getTripById(tripId);
      if (res.success && res.data) {
        setCurrentTrip(res.data);
      } else {
        throw new Error(res.message || "Unable to load trip details.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load requested trip plan."
      );
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const customizeItinerary = useCallback(
    async (tripId: string, instruction: string) => {
      if (!instruction || !instruction.trim()) return;

      setIsCustomizing(true);
      setError(null);
      try {
        const res = await tripApi.customizeTrip(tripId, instruction);
        if (res.success && res.data) {
          setCurrentTrip(res.data);
        } else {
          throw new Error(res.message || "Failed to customize trip.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Customization failed. Try again."
        );
      } finally {
        setIsCustomizing(false);
      }
    },
    []
  );

  const regenerateItinerary = useCallback(async (tripId: string) => {
    setIsRegenerating(true);
    setError(null);
    try {
      const res = await tripApi.regenerateTrip(tripId);
      if (res.success && res.data) {
        setCurrentTrip(res.data);
        if (res.usage) {
          setUsage((prev) =>
            prev
              ? {
                  ...prev,
                  generations_count: res.usage!.generationsCount,
                  max_allowed: res.usage!.maxAllowed,
                }
              : null
          );
        }
      } else {
        throw new Error(res.message || "Regeneration failed.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Regeneration failed or generation quota limit reached."
      );
    } finally {
      setIsRegenerating(false);
    }
  }, []);

  return {
    preferences,
    setPreferences,
    currentTrip,
    setCurrentTrip,
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
  };
}
