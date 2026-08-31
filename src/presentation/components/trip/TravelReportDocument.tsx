"use client";

import React from "react";
import { TripModel } from "../../../domain/trip/trip.types";
import "./TravelReportDocument.css";

interface TravelReportDocumentProps {
  trip: TripModel;
}

export const TravelReportDocument: React.FC<TravelReportDocumentProps> = ({
  trip,
}) => {
  const {
    destinationDetails,
    preferences,
    itinerary,
    budgetBreakdown,
    weatherForecast,
  } = trip;

  return (
    <div className="travel-pdf-report-root">
      {/* Document Header */}
      <div className="pdf-header">
        <div className="pdf-header-row">
          <div className="pdf-logo">TRIPZO AI TRAVEL PLANNER</div>
          <div className="pdf-meta">
            Generated on {new Date().toLocaleDateString()} | Ref #{trip.trip_id.slice(0, 8)}
          </div>
        </div>
        <h1 className="pdf-title">
          {destinationDetails?.name || preferences.destination}
        </h1>
        <div className="pdf-subtitle">
          {preferences.startDate} to {preferences.endDate} &bull; {preferences.adults}{" "}
          Adults &bull; {preferences.travelStyle} Vibe &bull; Total Budget:{" "}
          {preferences.totalBudget} {preferences.currency}
        </div>
      </div>

      {/* Weather Forecast Summary Table */}
      {weatherForecast && weatherForecast.length > 0 && (
        <div className="pdf-section">
          <h2 className="pdf-section-title">Verified Weather Forecast</h2>
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Condition</th>
                <th>Temp Range</th>
                <th>Rain Probability</th>
              </tr>
            </thead>
            <tbody>
              {weatherForecast.map((w) => (
                <tr key={w.date}>
                  <td>{w.date}</td>
                  <td>{w.condition}</td>
                  <td>
                    {w.minTempC}°C - {w.maxTempC}°C
                  </td>
                  <td>{w.precipitationProbPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Day-by-Day Itinerary */}
      <div className="pdf-section">
        <h2 className="pdf-section-title">Day-by-Day Schedule</h2>
        {itinerary.map((day) => (
          <div key={day.dayNumber} className="pdf-day-block">
            <h3 className="pdf-day-header">
              Day {day.dayNumber} ({day.date}): {day.theme}
            </h3>

            {day.accommodation && (
              <div className="pdf-hotel-row">
                <strong>Hotel Accommodation:</strong> {day.accommodation.name} (Rating:{" "}
                {day.accommodation.rating}) - {day.accommodation.address}
              </div>
            )}

            <div className="pdf-activities-list">
              {day.activities.map((act, i) => (
                <div key={i} className="pdf-activity-item">
                  <div className="pdf-act-time">
                    [{act.timeSlot || act.timeOfDay}]
                  </div>
                  <div className="pdf-act-body">
                    <strong>{act.title}</strong> — {act.placeName} ({act.durationMinutes} mins)
                    <p>{act.description}</p>
                    <span className="pdf-cost-tag">
                      Est. Cost: {act.estimatedCost} {budgetBreakdown?.currency || preferences.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Budget Breakdown Summary */}
      {budgetBreakdown && (
        <div className="pdf-section">
          <h2 className="pdf-section-title">Estimated Budget Allocation</h2>
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Allocation ({budgetBreakdown.currency})</th>
                <th>% Share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accommodation</td>
                <td>{budgetBreakdown.accommodationTotal}</td>
                <td>40%</td>
              </tr>
              <tr>
                <td>Dining & Food</td>
                <td>{budgetBreakdown.foodTotal}</td>
                <td>30%</td>
              </tr>
              <tr>
                <td>Attractions & Activities</td>
                <td>{budgetBreakdown.activitiesTotal}</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>Local Transport</td>
                <td>{budgetBreakdown.transportTotal}</td>
                <td>10%</td>
              </tr>
              <tr>
                <td>Contingency Reserve</td>
                <td>{budgetBreakdown.contingency}</td>
                <td>5%</td>
              </tr>
              <tr className="pdf-total-row">
                <td><strong>Total Estimated Cost</strong></td>
                <td><strong>{budgetBreakdown.totalEstimatedCost}</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="pdf-footer">
        Confidential Travel Report &bull; Powered by Tripzo AI Engine, Google Maps Platform & Weather Services
      </div>
    </div>
  );
};
