"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAppLayout } from "../../components/layouts/UserAppLayout";
import { useAuth } from "../../../application/providers/AuthContext";
import { useUserTrips } from "../../../application/hooks/useUserTrips";
import {
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Plane,
  Luggage,
  Plus,
} from "lucide-react";
import "./style.css";

export const HomeFeature: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { trips, usage, isLoading } = useUserTrips();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("5");

  const handleStartPlanning = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetDest = destination.trim();
    if (targetDest) {
      router.push(`/planner?destination=${encodeURIComponent(targetDest)}&days=${days}`);
    } else {
      router.push("/planner");
    }
  };

  const handleOpenPlan = (tripId: string) => {
    router.push(`/planner?tripId=${tripId}`);
  };

  return (
    <UserAppLayout>
      <div className="user-home-feature">
        {/* Welcome Hero Banner */}
        <section className="user-hero-card">
          <div className="user-hero-card__content">
            <span className="user-hero-badge">
              <Sparkles className="user-hero-badge__icon" />
              <span>Tripzo AI Travel Engine</span>
            </span>

            <h1 className="user-hero-title">
              Where to next, {user?.name ? user.name.split(" ")[0] : "Traveler"}?{" "}
              <Plane size={28} className="inline-hero-icon" />
            </h1>
            <p className="user-hero-subtitle">
              Enter a destination and let Tripzo generate a complete personalized travel itinerary in seconds.
            </p>

            {/* AI Trip Launcher Box */}
            <form onSubmit={handleStartPlanning} className="ai-planner-box">
              <div className="ai-planner-input-group">
                <MapPin className="ai-planner-icon" />
                <input
                  type="text"
                  placeholder="Where do you want to go? (e.g. Lonavala, Goa, Paris, Tokyo)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="ai-planner-input"
                />
              </div>

              <div className="ai-planner-input-group ai-planner-input-group--short">
                <Calendar className="ai-planner-icon" />
                <select
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="ai-planner-select"
                >
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                </select>
              </div>

              <button type="submit" className="ai-planner-btn">
                <span>Generate Itinerary</span>
                <ArrowRight className="ai-planner-btn-icon" />
              </button>
            </form>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="user-stats-grid">
          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper user-stat-icon-wrapper--purple">
              <Compass className="user-stat-icon" />
            </div>
            <div>
              <span className="user-stat-label">Saved Trips</span>
              <span className="user-stat-value">{trips.length} Trips</span>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper user-stat-icon-wrapper--amber">
              <Sparkles className="user-stat-icon" />
            </div>
            <div>
              <span className="user-stat-label">Generation Limit</span>
              <span className="user-stat-value">
                {usage ? `${usage.generations_count} / ${usage.max_allowed}` : "10 Allowed"}
              </span>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper user-stat-icon-wrapper--emerald">
              <Luggage className="user-stat-icon" />
            </div>
            <div>
              <span className="user-stat-label">Travel Status</span>
              <span className="user-stat-value">Ready to Travel</span>
            </div>
          </div>
        </section>

        {/* Saved Itineraries Section */}
        <section className="user-trips-section">
          <div className="section-title-row">
            <h2 className="user-section-title">Your Recent Itineraries</h2>
            {trips.length > 0 && (
              <button
                type="button"
                onClick={() => router.push("/bookings")}
                className="view-all-link"
              >
                View All ({trips.length}) &rarr;
              </button>
            )}
          </div>

          {!isLoading && trips.length > 0 ? (
            <div className="user-trips-grid">
              {trips.slice(0, 3).map((trip) => {
                const destName = trip.destinationDetails?.name || trip.preferences.destination;
                return (
                  <div
                    key={trip.trip_id}
                    className="user-trip-card"
                    onClick={() => handleOpenPlan(trip.trip_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="user-trip-card__image-placeholder">
                      <span className="user-trip-tag">
                        {trip.itinerary?.length || 3} Days
                      </span>
                    </div>
                    <div className="user-trip-card__body">
                      <h3 className="user-trip-title">{destName}</h3>
                      <p className="user-trip-desc">
                        {trip.preferences.startDate} to {trip.preferences.endDate} &bull; {trip.preferences.travelStyle} vibe.
                      </p>
                      <div className="user-trip-card__footer">
                        <span className="user-trip-status">AI Generated</span>
                        <span className="user-trip-action">View Plan →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="home-empty-trips-card">
              <p>No saved itineraries found. Enter your destination above to create your first trip!</p>
            </div>
          )}
        </section>
      </div>
    </UserAppLayout>
  );
};

export default HomeFeature;
