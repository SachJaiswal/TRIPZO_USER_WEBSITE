import { defaultPreferences } from "../application/hooks/useTripPlanner";
import { TripModel } from "../domain/trip/trip.types";

export function validateTripPlannerTypes(): boolean {
  // 1. Verify default preferences structure
  if (defaultPreferences.adults < 1) return false;
  if (defaultPreferences.rooms < 1) return false;
  if (defaultPreferences.totalBudget <= 0) return false;

  // 2. Verify TripModel contract mapping
  const mockTrip: TripModel = {
    trip_id: "test-trip-uuid-1234",
    user_generated_id: "USR-1001",
    destinationDetails: {
      place_id: "ChIJkbe4w9_E5zsR0g9g9g9g9g9",
      name: "Lonavala, Maharashtra, India",
      formattedAddress: "Lonavala, Maharashtra, India",
      location: { lat: 18.7557, lng: 73.4091 },
    },
    preferences: { ...defaultPreferences, destination: "Lonavala" },
    candidateHotels: [
      {
        place_id: "google_hotel_01",
        name: "Della Resorts",
        rating: 4.6,
        user_ratings_total: 1200,
        address: "Kune Village, Lonavala",
        location: { lat: 18.75, lng: 73.4 },
      },
    ],
    candidateAttractions: [
      {
        place_id: "google_attraction_01",
        name: "Tiger's Leap Viewpoint",
        rating: 4.7,
        user_ratings_total: 3500,
        address: "Kurvande, Lonavala",
        location: { lat: 18.76, lng: 73.41 },
        types: ["tourist_attraction", "viewpoint"],
      },
    ],
    candidateRestaurants: [
      {
        place_id: "google_rest_01",
        name: "The Rama Krishna",
        rating: 4.4,
        user_ratings_total: 800,
        address: "Old Mumbai-Pune Highway, Lonavala",
        location: { lat: 18.75, lng: 73.4 },
      },
    ],
    weatherForecast: [
      {
        date: "2026-09-10",
        maxTempC: 28,
        minTempC: 21,
        condition: "Partly Cloudy",
        precipitationProbPercent: 15,
      },
    ],
    itinerary: [
      {
        dayNumber: 1,
        date: "2026-09-10",
        theme: "Arrival & Tiger's Leap Viewpoint",
        weatherSummary: {
          date: "2026-09-10",
          maxTempC: 28,
          minTempC: 21,
          condition: "Partly Cloudy",
          precipitationProbPercent: 15,
        },
        accommodation: {
          place_id: "google_hotel_01",
          name: "Della Resorts",
          rating: 4.6,
          user_ratings_total: 1200,
          address: "Kune Village, Lonavala",
          location: { lat: 18.75, lng: 73.4 },
        },
        activities: [
          {
            timeOfDay: "morning",
            timeSlot: "09:30 - 12:00",
            title: "Visit Tiger's Leap",
            description: "Scenic cliff viewpoint with echo point.",
            place_id: "google_attraction_01",
            placeName: "Tiger's Leap Viewpoint",
            location: { lat: 18.76, lng: 73.41 },
            estimatedCost: 0,
            durationMinutes: 150,
          },
        ],
        dailyTransport: {
          mode: "rental_car",
          estimatedCost: 500,
        },
        estimatedDailyCost: 2500,
      },
    ],
    budgetBreakdown: {
      accommodationTotal: 6000,
      foodTotal: 4500,
      activitiesTotal: 2250,
      transportTotal: 1500,
      contingency: 750,
      totalEstimatedCost: 15000,
      currency: "INR",
    },
    customizationHistory: [],
    generationCount: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return mockTrip.trip_id === "test-trip-uuid-1234";
}
