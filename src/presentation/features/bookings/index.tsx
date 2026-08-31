"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAppLayout } from "../../components/layouts/UserAppLayout";
import { useUserTrips } from "../../../application/hooks/useUserTrips";
import {
  Compass,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
  Plus,
  AlertCircle,
  Users,
  DollarSign,
} from "lucide-react";
import "./style.css";

export const BookingsFeature: React.FC = () => {
  const router = useRouter();
  const {
    trips,
    usage,
    isLoading,
    isDeleting,
    error,
    search,
    setSearch,
    totalCount,
    deleteTrip,
  } = useUserTrips();

  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  const handleOpenTrip = (tripId: string) => {
    router.push(`/planner?tripId=${tripId}`);
  };

  const handleCreateNew = () => {
    router.push("/planner");
  };

  const handleDelete = async (tripId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this saved trip plan?")) {
      setDeletingTripId(tripId);
      await deleteTrip(tripId);
      setDeletingTripId(null);
    }
  };

  return (
    <UserAppLayout>
      <div className="user-bookings-feature">
        {/* Header */}
        <header className="user-page-header">
          <div>
            <h1 className="user-page-title">My Saved Travel Plans</h1>
            <p className="user-page-subtitle">
              View, customize, and manage your AI-generated travel itineraries.
            </p>
          </div>

          <button type="button" onClick={handleCreateNew} className="new-trip-btn">
            <Plus size={18} />
            <span>New Trip</span>
          </button>
        </header>

        {/* Quota Banner & Search Bar */}
        <div className="bookings-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search saved trips by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {usage && (
            <div className="usage-quota-badge">
              <Sparkles size={16} />
              <span>
                Generation Quota: <strong>{usage.generations_count} / {usage.max_allowed}</strong> Used
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="bookings-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="bookings-loading-box">
            <div className="spinner" />
            <p>Loading your saved travel itineraries...</p>
          </div>
        )}

        {/* Trips Grid */}
        {!isLoading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map((trip) => {
              const destName = trip.destinationDetails?.name || trip.preferences.destination;
              return (
                <div
                  key={trip.trip_id}
                  onClick={() => handleOpenTrip(trip.trip_id)}
                  className="trip-card"
                >
                  <div className="trip-card-hero">
                    <div className="hero-gradient" />
                    <span className="dest-badge">{destName}</span>
                    <span className="days-badge">
                      {trip.itinerary?.length || 3} Days
                    </span>
                  </div>

                  <div className="trip-card-body">
                    <h3 className="trip-card-title">{destName}</h3>

                    <div className="trip-card-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>
                          {trip.preferences.startDate} to {trip.preferences.endDate}
                        </span>
                      </div>

                      <div className="meta-item">
                        <Users size={14} />
                        <span>
                          {trip.preferences.adults} Adults, {trip.preferences.children || 0} Children
                        </span>
                      </div>

                      <div className="meta-item">
                        <DollarSign size={14} />
                        <span>
                          Budget: {trip.preferences.totalBudget} {trip.preferences.currency}
                        </span>
                      </div>
                    </div>

                    <div className="trip-card-footer">
                      <span className="created-date">
                        Created {new Date(trip.created_at).toLocaleDateString()}
                      </span>

                      <div className="card-actions">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(trip.trip_id, e)}
                          disabled={deletingTripId === trip.trip_id || isDeleting}
                          className="delete-trip-btn"
                          title="Delete trip"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button type="button" className="open-trip-btn">
                          <span>View Plan</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trips.length === 0 && (
          <div className="user-bookings-card">
            <div className="user-bookings-empty">
              <Compass className="user-bookings-empty-icon" size={48} />
              <h3>No Saved Travel Plans Yet</h3>
              <p>
                You have not created any trip plans yet. Start by entering your destination
                and preferences on our AI Planner.
              </p>
              <button type="button" onClick={handleCreateNew} className="new-trip-btn">
                <Sparkles size={18} />
                <span>Create Your First Trip</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </UserAppLayout>
  );
};

export default BookingsFeature;
