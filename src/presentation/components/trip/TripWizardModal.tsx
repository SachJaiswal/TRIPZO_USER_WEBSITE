"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Compass,
  CheckCircle2,
  Car,
  Hotel,
} from "lucide-react";
import { TripPreferences } from "../../../domain/trip/trip.types";
import "./TripWizardModal.css";

interface TripWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: TripPreferences) => void;
  initialPreferences: TripPreferences;
  isGenerating?: boolean;
}

const INTEREST_OPTIONS = [
  "nature",
  "waterfalls",
  "viewpoints",
  "food",
  "culture",
  "beach",
  "shopping",
  "history",
  "art",
  "nightlife",
  "relaxation",
  "adventure",
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"];

export const TripWizardModal: React.FC<TripWizardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPreferences,
  isGenerating = false,
}) => {
  const [step, setStep] = useState<number>(1);
  const [prefs, setPrefs] = useState<TripPreferences>(initialPreferences);
  const [validationError, setValidationError] = useState<string | null>(null);

  React.useEffect(() => {
    setPrefs(initialPreferences);
  }, [initialPreferences]);

  if (!isOpen) return null;

  const handleChange = (field: keyof TripPreferences, value: any) => {
    setValidationError(null);
    setPrefs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setPrefs((prev) => {
      const exists = prev.interests.includes(interest);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!prefs.destination || !prefs.destination.trim()) {
        setValidationError("Please enter a destination city or region.");
        return false;
      }
      if (!prefs.startDate || !prefs.endDate) {
        setValidationError("Please select valid travel dates.");
        return false;
      }
      const s = new Date(prefs.startDate);
      const e = new Date(prefs.endDate);
      if (e < s) {
        setValidationError("End date cannot be earlier than start date.");
        return false;
      }
    } else if (currentStep === 2) {
      if (prefs.adults < 1) {
        setValidationError("At least 1 adult traveler is required.");
        return false;
      }
      if (prefs.rooms < 1) {
        setValidationError("At least 1 room is required.");
        return false;
      }
    } else if (currentStep === 3) {
      if (!prefs.totalBudget || prefs.totalBudget <= 0) {
        setValidationError("Total budget must be greater than zero.");
        return false;
      }
    } else if (currentStep === 4) {
      if (!prefs.interests || prefs.interests.length === 0) {
        setValidationError("Please select at least one interest.");
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setValidationError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const validateAllSteps = (): boolean => {
    return validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    if (validateAllSteps()) {
      onSubmit(prefs);
    }
  };

  return (
    <div className="wizard-modal-overlay">
      <div className="wizard-modal-container">
        {/* Header */}
        <div className="wizard-modal-header">
          <div className="wizard-header-title">
            <Sparkles className="wizard-sparkle-icon" />
            <h2>Plan a New AI Trip</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="wizard-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="wizard-steps-bar">
          <div className={`wizard-step-item ${step >= 1 ? "active" : ""}`}>
            <span className="step-num">1</span>
            <span className="step-label">Destination</span>
          </div>
          <div className="wizard-step-line" />
          <div className={`wizard-step-item ${step >= 2 ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-label">Travelers</span>
          </div>
          <div className="wizard-step-line" />
          <div className={`wizard-step-item ${step >= 3 ? "active" : ""}`}>
            <span className="step-num">3</span>
            <span className="step-label">Budget</span>
          </div>
          <div className="wizard-step-line" />
          <div className={`wizard-step-item ${step >= 4 ? "active" : ""}`}>
            <span className="step-num">4</span>
            <span className="step-label">Vibe & Style</span>
          </div>
        </div>

        {validationError && (
          <div className="wizard-error-banner">{validationError}</div>
        )}

        {/* Form Body */}
        <form onSubmit={(e) => e.preventDefault()} className="wizard-modal-body">
          {/* STEP 1: Destination & Dates */}
          {step === 1 && (
            <div className="wizard-step-content">
              <h3>Where and when are you traveling?</h3>
              <p className="wizard-step-subtitle">
                Enter any destination worldwide. Google Places and Weather APIs
                will pull real real-world data.
              </p>

              <div className="wizard-field-group">
                <label>
                  <MapPin size={16} /> Destination City or Region
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lonavala, Goa, Paris, Tokyo, Bali"
                  value={prefs.destination}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  disabled={isGenerating}
                  autoFocus
                  className="wizard-input-text"
                />
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field-group">
                  <label>
                    <Calendar size={16} /> Start Date
                  </label>
                  <input
                    type="date"
                    value={prefs.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    disabled={isGenerating}
                    className="wizard-input-text"
                  />
                </div>

                <div className="wizard-field-group">
                  <label>
                    <Calendar size={16} /> End Date
                  </label>
                  <input
                    type="date"
                    value={prefs.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    disabled={isGenerating}
                    className="wizard-input-text"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Travelers & Rooms */}
          {step === 2 && (
            <div className="wizard-step-content">
              <h3>Who is traveling with you?</h3>
              <p className="wizard-step-subtitle">
                Specify guests and room requirements to calculate hotel price
                ranges and daily food budgets.
              </p>

              <div className="wizard-grid-3">
                <div className="wizard-field-group">
                  <label>
                    <Users size={16} /> Adults (18+)
                  </label>
                  <div className="number-counter">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() =>
                        handleChange("adults", Math.max(1, prefs.adults - 1))
                      }
                    >
                      -
                    </button>
                    <span>{prefs.adults}</span>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleChange("adults", prefs.adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="wizard-field-group">
                  <label>
                    <Users size={16} /> Children
                  </label>
                  <div className="number-counter">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() =>
                        handleChange("children", Math.max(0, prefs.children - 1))
                      }
                    >
                      -
                    </button>
                    <span>{prefs.children}</span>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleChange("children", prefs.children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="wizard-field-group">
                  <label>
                    <Hotel size={16} /> Hotel Rooms
                  </label>
                  <div className="number-counter">
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() =>
                        handleChange("rooms", Math.max(1, prefs.rooms - 1))
                      }
                    >
                      -
                    </button>
                    <span>{prefs.rooms}</span>
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={() => handleChange("rooms", prefs.rooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Currency */}
          {step === 3 && (
            <div className="wizard-step-content">
              <h3>What is your total travel budget?</h3>
              <p className="wizard-step-subtitle">
                Our Budget Engine will allocate ~40% for accommodation, ~30% for
                dining, ~15% for activities, ~10% for transport, and ~5%
                contingency.
              </p>

              <div className="wizard-grid-2">
                <div className="wizard-field-group">
                  <label>Currency</label>
                  <select
                    value={prefs.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    disabled={isGenerating}
                    className="wizard-select"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="wizard-field-group">
                  <label>
                  Total Budget
                  </label>
                  <input
            
                    value={prefs.totalBudget}
                    onChange={(e) =>
                      handleChange("totalBudget", parseFloat(e.target.value) || 0)
                    }
                    
                    className="wizard-input-text"
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Vibe */}
          {step === 4 && (
            <div className="wizard-step-content">
              <h3>Customize your travel style & interests</h3>
              <p className="wizard-step-subtitle">
                Select your vibe so OpenAI ranks candidate places matching your
                exact preferences.
              </p>

              <div className="wizard-grid-2">
                <div className="wizard-field-group">
                  <label>Travel Style</label>
                  <select
                    value={prefs.travelStyle}
                    onChange={(e) => handleChange("travelStyle", e.target.value)}
                    disabled={isGenerating}
                    className="wizard-select"
                  >
                    <option value="relaxed">Relaxed & Slow-paced</option>
                    <option value="balanced">Balanced Sightseeing</option>
                    <option value="fast-paced">Fast-Paced & Packed</option>
                    <option value="adventure">Outdoor & Adventure</option>
                    <option value="family-friendly">Family Friendly</option>
                  </select>
                </div>

                <div className="wizard-field-group">
                  <label>Accommodation Style</label>
                  <select
                    value={prefs.accommodationPreference}
                    onChange={(e) =>
                      handleChange("accommodationPreference", e.target.value)
                    }
                    disabled={isGenerating}
                    className="wizard-select"
                  >
                    <option value="resort">Resort / Spa</option>
                    <option value="mid-range">Comfort / Mid-Range Hotel</option>
                    <option value="luxury">5-Star Luxury Hotel</option>
                    <option value="boutique">Boutique Hotel</option>
                    <option value="budget">Budget / Hostel</option>
                  </select>
                </div>
              </div>

              <div className="wizard-grid-2">
                <div className="wizard-field-group">
                  <label>Min Hotel Rating</label>
                  <select
                    value={prefs.minHotelRating}
                    onChange={(e) =>
                      handleChange("minHotelRating", parseFloat(e.target.value))
                    }
                    disabled={isGenerating}
                    className="wizard-select"
                  >
                    <option value="4.5">4.5+ Rating Only</option>
                    <option value="4.0">4.0+ Rating (Recommended)</option>
                    <option value="3.5">3.5+ Rating</option>
                    <option value="3.0">3.0+ Rating</option>
                  </select>
                </div>

                <div className="wizard-field-group">
                  <label>Transportation Preference</label>
                  <select
                    value={prefs.transportationPreference}
                    onChange={(e) =>
                      handleChange("transportationPreference", e.target.value)
                    }
                    disabled={isGenerating}
                    className="wizard-select"
                  >
                    <option value="rental_car">Rental Car / Private Cab</option>
                    <option value="public_transit">Public Transit / Metro</option>
                    <option value="walking">Walking & Rideshare</option>
                    <option value="mixed">Mixed Transportation</option>
                  </select>
                </div>
              </div>

              <div className="wizard-field-group">
                <label>Select Interests</label>
                <div className="interests-chip-grid">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = prefs.interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => toggleInterest(item)}
                        className={`interest-chip ${isSelected ? "selected" : ""}`}
                      >
                        {isSelected && <CheckCircle2 size={14} />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="wizard-modal-footer">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isGenerating}
                className="wizard-btn wizard-btn-back"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isGenerating}
                className="wizard-btn wizard-btn-next"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isGenerating}
                className="wizard-btn wizard-btn-submit"
              >
                <Sparkles size={18} />
                <span>
                  {isGenerating ? "Generating Itinerary..." : "Generate Travel Plan"}
                </span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
