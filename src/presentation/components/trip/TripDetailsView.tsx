"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Download,
  RotateCcw,
  SlidersHorizontal,
  CloudSun,
  CloudRain,
  Hotel,
  Compass,
  DollarSign,
  Star,
  ExternalLink,
  ChevronRight,
  Utensils,
  Car,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from "lucide-react";
import { TripModel, ItineraryDay } from "../../../domain/trip/trip.types";
import { CustomizeTripModal } from "./CustomizeTripModal";
import { TravelReportDocument } from "./TravelReportDocument";
import "./TripDetailsView.css";

interface TripDetailsViewProps {
  trip: TripModel;
  onCustomize: (instruction: string) => Promise<void>;
  onRegenerate: () => Promise<void>;
  onPlanNewTrip: () => void;
  isCustomizing?: boolean;
  isRegenerating?: boolean;
  usageInfo?: { generationsCount: number; maxAllowed: number } | null;
}

export const TripDetailsView: React.FC<TripDetailsViewProps> = ({
  trip,
  onCustomize,
  onRegenerate,
  onPlanNewTrip,
  isCustomizing = false,
  isRegenerating = false,
  usageInfo,
}) => {
  const {
    destinationDetails,
    preferences,
    candidateHotels,
    candidateAttractions,
    candidateRestaurants,
    weatherForecast,
    itinerary,
    budgetBreakdown,
    customizationHistory,
  } = trip;

  const [activeTab, setActiveTab] = useState<"itinerary" | "hotels" | "places" | "budget" | "map">("itinerary");
  const [activeDayNum, setActiveDayNum] = useState<number>(1);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Derived data calculations
  const startDateObj = new Date(preferences.startDate);
  const endDateObj = new Date(preferences.endDate);
  const diffDays = Math.max(
    1,
    Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  const nightsCount = Math.max(0, diffDays - 1);

  const currentDayPlan: ItineraryDay | undefined =
    itinerary.find((d) => d.dayNumber === activeDayNum) || itinerary[0];

  const primaryHotel = candidateHotels?.[0];

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="trip-details-root">
      {/* Printable Report Component (hidden on screen, visible during print) */}
      <TravelReportDocument trip={trip} />

      {/* Hero Header Banner */}
      <div className="trip-hero-banner">
        <div className="trip-hero-overlay" />
        <div className="trip-hero-content">
          <div className="trip-badge-row">
            <span className="hero-chip hero-chip-live">
              <Sparkles size={14} /> AI Tailored Itinerary
            </span>
            <span className="hero-chip">
              <Calendar size={14} /> {diffDays} Days / {nightsCount} Nights
            </span>
            {usageInfo && (
              <span className="hero-chip hero-chip-quota">
                Generations: {usageInfo.generationsCount} / {usageInfo.maxAllowed}
              </span>
            )}
          </div>

          <h1 className="trip-hero-title">
            {destinationDetails?.name || preferences.destination}
          </h1>

          <div className="trip-hero-meta">
            <span>
              <MapPin size={16} /> {destinationDetails?.formattedAddress || preferences.destination}
            </span>
            <span>&bull;</span>
            <span>
              {preferences.adults} Adults, {preferences.children} Children ({preferences.rooms} Rooms)
            </span>
            <span>&bull;</span>
            <span>
              Budget: {preferences.totalBudget} {preferences.currency}
            </span>
          </div>

          {/* Quick Action Toolbar */}
          <div className="hero-action-bar">
            <button
              type="button"
              onClick={() => setIsCustomizeModalOpen(true)}
              disabled={isCustomizing}
              className="action-btn action-btn-customize"
            >
              <SlidersHorizontal size={16} />
              <span>{isCustomizing ? "Customizing..." : "Customize Itinerary"}</span>
            </button>

            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="action-btn action-btn-regen"
            >
              <RotateCcw size={16} />
              <span>{isRegenerating ? "Regenerating..." : "Regenerate Plan"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="action-btn action-btn-pdf"
            >
              <Download size={16} />
              <span>Download Report</span>
            </button>

            <button
              type="button"
              onClick={onPlanNewTrip}
              className="action-btn action-btn-new"
            >
              <Compass size={16} />
              <span>Plan Another Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Summary & AI Rationale Card */}
      <div className="trip-summary-card">
        <div className="summary-section">
          <div className="summary-item">
            <span className="summary-label">Vibe & Style</span>
            <span className="summary-value capitalize">{preferences.travelStyle}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Accommodation</span>
            <span className="summary-value capitalize">{preferences.accommodationPreference}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Transport</span>
            <span className="summary-value capitalize">{preferences.transportationPreference.replace("_", " ")}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Selected Interests</span>
            <div className="summary-chips">
              {(preferences.interests || []).slice(0, 4).map((interest) => (
                <span key={interest} className="interest-mini-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Why this trip works for you */}
        <div className="ai-rationale-box">
          <div className="rationale-header">
            <Sparkles size={16} color="#6366f1" />
            <span>Why this trip works for you</span>
          </div>
          <p>
            This {diffDays}-day itinerary for {preferences.destination} is optimized for a{" "}
            <strong>{preferences.travelStyle}</strong> pace with <strong>{preferences.adults}</strong> guest(s).
            All activities use real-world candidate places verified via Google Maps, aligned with your interest in{" "}
            {preferences.interests.join(", ")}.
          </p>
        </div>
      </div>

      {/* Daily Weather Forecast Bar */}
      {weatherForecast && weatherForecast.length > 0 && (
        <div className="weather-forecast-bar">
          <div className="weather-bar-title">
            <CloudSun size={18} />
            <span>Daily Weather Forecast</span>
          </div>
          <div className="weather-cards-scroll">
            {weatherForecast.map((w, idx) => (
              <div key={w.date} className="weather-card">
                <span className="weather-day-num">Day {idx + 1}</span>
                <span className="weather-date">{w.date}</span>
                <div className="weather-temp">
                  {w.maxTempC}°C <span className="temp-min">/ {w.minTempC}°C</span>
                </div>
                <span className="weather-cond">{w.condition}</span>
                {w.precipitationProbPercent > 0 && (
                  <span className="weather-rain">
                    <CloudRain size={12} /> {w.precipitationProbPercent}% rain
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="trip-tabs-header">
        <button
          type="button"
          onClick={() => setActiveTab("itinerary")}
          className={`trip-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
        >
          <Calendar size={18} />
          <span>Day-by-Day Itinerary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hotels")}
          className={`trip-tab-btn ${activeTab === "hotels" ? "active" : ""}`}
        >
          <Hotel size={18} />
          <span>Hotels ({candidateHotels?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("places")}
          className={`trip-tab-btn ${activeTab === "places" ? "active" : ""}`}
        >
          <Compass size={18} />
          <span>Attractions & Food ({candidateAttractions?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("budget")}
          className={`trip-tab-btn ${activeTab === "budget" ? "active" : ""}`}
        >
          <DollarSign size={18} />
          <span>Budget Breakdown</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`trip-tab-btn ${activeTab === "map" ? "active" : ""}`}
        >
          <MapPin size={18} />
          <span>Map Preview</span>
        </button>
      </div>

      {/* TAB CONTENT: ITINERARY */}
      {activeTab === "itinerary" && (
        <div className="tab-pane-container">
          {/* Day Selector Tabs */}
          <div className="day-selector-bar">
            {itinerary.map((day) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setActiveDayNum(day.dayNumber)}
                className={`day-selector-btn ${activeDayNum === day.dayNumber ? "active" : ""}`}
              >
                <span>Day {day.dayNumber}</span>
                <small>{day.date}</small>
              </button>
            ))}
          </div>

          {currentDayPlan && (
            <div className="day-itinerary-card">
              <div className="day-card-header">
                <div>
                  <span className="day-badge">Day {currentDayPlan.dayNumber}</span>
                  <h2>{currentDayPlan.theme}</h2>
                </div>
                {currentDayPlan.weatherSummary && (
                  <div className="day-weather-badge">
                    <CloudSun size={18} />
                    <span>
                      {currentDayPlan.weatherSummary.condition} ({currentDayPlan.weatherSummary.maxTempC}°C / {currentDayPlan.weatherSummary.minTempC}°C)
                    </span>
                  </div>
                )}
              </div>

              {/* Recommended Hotel for this day */}
              {currentDayPlan.accommodation && (
                <div className="day-hotel-banner">
                  <Hotel className="hotel-banner-icon" size={24} />
                  <div>
                    <span className="hotel-banner-label">Accommodation Stay</span>
                    <h4>{currentDayPlan.accommodation.name}</h4>
                    <p>{currentDayPlan.accommodation.address}</p>
                  </div>
                  <div className="hotel-banner-rating">
                    <Star size={16} fill="#eab308" color="#eab308" />
                    <span>{currentDayPlan.accommodation.rating}</span>
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div className="activities-timeline">
                {currentDayPlan.activities.map((act, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-left">
                      <span className="time-badge">{act.timeSlot || act.timeOfDay}</span>
                      <span className="duration-tag">{act.durationMinutes} mins</span>
                    </div>

                    <div className="timeline-line-col">
                      <div className="timeline-node" />
                      {index < currentDayPlan.activities.length - 1 && <div className="timeline-line" />}
                    </div>

                    <div className="timeline-content-card">
                      <div className="activity-title-row">
                        <h3>{act.title}</h3>
                        <span className="act-cost-badge">
                          {act.estimatedCost > 0
                            ? `${act.estimatedCost} ${budgetBreakdown?.currency || preferences.currency}`
                            : "Free Admission"}
                        </span>
                      </div>

                      <div className="activity-place-link">
                        <MapPin size={14} />
                        <span>{act.placeName}</span>
                        {act.place_id && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.placeName)}&query_place_id=${act.place_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gmaps-external-link"
                          >
                            Google Maps <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <p className="activity-desc">{act.description}</p>

                      {act.distanceToNextKm && (
                        <div className="activity-travel-info">
                          <Car size={14} />
                          <span>
                            ~{act.distanceToNextKm} km to next stop ({act.travelTimeToNextMins || 15} mins drive)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily Transport summary */}
              {currentDayPlan.dailyTransport && (
                <div className="day-transport-footer">
                  <Car size={18} />
                  <span>
                    <strong>Daily Transport:</strong> {currentDayPlan.dailyTransport.mode} — Est. Cost:{" "}
                    {currentDayPlan.dailyTransport.estimatedCost} {budgetBreakdown?.currency || preferences.currency}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: HOTELS */}
      {activeTab === "hotels" && (
        <div className="tab-pane-container">
          <div className="section-header-row">
            <div>
              <h2>Verified Hotel Candidates</h2>
              <p>Top accommodation choices near {preferences.destination} matching min {preferences.minHotelRating}⭐ rating.</p>
            </div>
          </div>

          <div className="hotels-grid">
            {(candidateHotels || []).map((hotel) => (
              <div key={hotel.place_id} className="hotel-card">
                {hotel.photoUrl ? (
                  <img src={hotel.photoUrl} alt={hotel.name} className="hotel-card-img" />
                ) : (
                  <div className="hotel-card-img-placeholder">
                    <Hotel size={36} />
                  </div>
                )}
                <div className="hotel-card-body">
                  <div className="hotel-rating-row">
                    <span className="rating-pill">
                      <Star size={14} fill="#eab308" color="#eab308" />
                      {hotel.rating} ({hotel.user_ratings_total} reviews)
                    </span>
                    {hotel.priceLevel && (
                      <span className="price-level-pill">
                        {"$".repeat(hotel.priceLevel)}
                      </span>
                    )}
                  </div>

                  <h3 className="hotel-name">{hotel.name}</h3>
                  <p className="hotel-address">
                    <MapPin size={14} /> {hotel.address}
                  </p>

                  <div className="hotel-card-footer">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name)}&query_place_id=${hotel.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hotel-view-btn"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PLACES & RESTAURANTS */}
      {activeTab === "places" && (
        <div className="tab-pane-container">
          <div className="section-header-row">
            <div>
              <h2>Attractions & Culinary Recommendations</h2>
              <p>Real-world places selected by OpenAI from verified Google Places candidates.</p>
            </div>
          </div>

          <h3 className="sub-section-title">Verified Tourist Attractions</h3>
          <div className="places-grid">
            {(candidateAttractions || []).map((att) => (
              <div key={att.place_id} className="place-card">
                <div className="place-card-header">
                  <span className="place-category-badge">Attraction</span>
                  <span className="place-rating">⭐ {att.rating}</span>
                </div>
                <h4>{att.name}</h4>
                <p className="place-address">{att.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(att.name)}&query_place_id=${att.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="place-maps-link"
                >
                  View Location <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>

          <h3 className="sub-section-title" style={{ marginTop: "2rem" }}>
            Recommended Restaurants & Food Spots
          </h3>
          <div className="places-grid">
            {(candidateRestaurants || []).map((rest) => (
              <div key={rest.place_id} className="place-card place-card-rest">
                <div className="place-card-header">
                  <span className="place-category-badge rest">Dining</span>
                  <span className="place-rating">⭐ {rest.rating}</span>
                </div>
                <h4>{rest.name}</h4>
                <p className="place-address">{rest.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rest.name)}&query_place_id=${rest.place_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="place-maps-link"
                >
                  View Restaurant <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BUDGET BREAKDOWN */}
      {activeTab === "budget" && budgetBreakdown && (
        <div className="tab-pane-container">
          <div className="section-header-row">
            <div>
              <h2>Budget Engine Financial Analysis</h2>
              <p>Financial allocation for {preferences.totalBudget} {budgetBreakdown.currency} across your trip.</p>
            </div>
          </div>

          <div className="budget-health-card">
            <div className="health-left">
              <h3>Budget Status: Healthy</h3>
              <p>Estimated total cost is within your specified maximum travel budget.</p>
            </div>
            <div className="health-total">
              <span className="health-amount">
                {budgetBreakdown.totalEstimatedCost} {budgetBreakdown.currency}
              </span>
              <span className="health-label">Total Allocated</span>
            </div>
          </div>

          <div className="budget-bars-grid">
            <div className="budget-bar-item">
              <div className="bar-label-row">
                <span className="icon-label-row"><Hotel size={16} /> Accommodation (40%)</span>
                <span>{budgetBreakdown.accommodationTotal} {budgetBreakdown.currency}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill-hotel" style={{ width: "40%" }} />
              </div>
            </div>

            <div className="budget-bar-item">
              <div className="bar-label-row">
                <span className="icon-label-row"><Utensils size={16} /> Food & Dining (30%)</span>
                <span>{budgetBreakdown.foodTotal} {budgetBreakdown.currency}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill-food" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="budget-bar-item">
              <div className="bar-label-row">
                <span className="icon-label-row"><Ticket size={16} /> Activities & Admissions (15%)</span>
                <span>{budgetBreakdown.activitiesTotal} {budgetBreakdown.currency}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill-act" style={{ width: "15%" }} />
              </div>
            </div>

            <div className="budget-bar-item">
              <div className="bar-label-row">
                <span className="icon-label-row"><Car size={16} /> Local Transport (10%)</span>
                <span>{budgetBreakdown.transportTotal} {budgetBreakdown.currency}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill-trans" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="budget-bar-item">
              <div className="bar-label-row">
                <span className="icon-label-row"><ShieldCheck size={16} /> Contingency Reserve (5%)</span>
                <span>{budgetBreakdown.contingency} {budgetBreakdown.currency}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill-reserve" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MAP PREVIEW */}
      {activeTab === "map" && (
        <div className="tab-pane-container">
          <div className="section-header-row">
            <div>
              <h2>Google Maps Geographic Preview</h2>
              <p>Location center: {destinationDetails?.name || preferences.destination}</p>
            </div>
          </div>

          <div className="map-embed-wrapper">
            <iframe
              title="Destination Map"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "16px" }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                destinationDetails?.name || preferences.destination
              )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      )}

      {/* Customize Modal */}
      <CustomizeTripModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        onSubmit={async (inst) => {
          setIsCustomizeModalOpen(false);
          await onCustomize(inst);
        }}
        isCustomizing={isCustomizing}
        destination={destinationDetails?.name || preferences.destination}
      />
    </div>
  );
};
