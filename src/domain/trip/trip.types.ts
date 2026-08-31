// =====================================================
// TRIP PREFERENCES INTERFACE
// =====================================================

export interface TripPreferences {
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  adults: number;
  children: number;
  rooms: number;
  totalBudget: number;
  currency: string;
  accommodationPreference: string;
  minHotelRating: number;
  interests: string[];
  travelStyle: string;
  transportationPreference: string;
}

// =====================================================
// GEOLOCATION & CANDIDATE PLACES (GOOGLE MAPS)
// =====================================================

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface DestinationDetails {
  name: string;
  formattedAddress: string;
  location: GeoLocation;
  place_id: string;
}

export interface CandidateHotel {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  address: string;
  location: GeoLocation;
  priceLevel?: number;
  photoUrl?: string;
  website?: string;
  estimatedNightlyRate?: number;
}

export interface CandidateAttraction {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  address: string;
  location: GeoLocation;
  types: string[];
  photoUrl?: string;
  estimatedCost?: number;
}

export interface CandidateRestaurant {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  address: string;
  location: GeoLocation;
  priceLevel?: number;
  cuisine?: string[];
  photoUrl?: string;
  estimatedCostPerPerson?: number;
}

// =====================================================
// WEATHER FORECAST
// =====================================================

export interface DayWeatherSummary {
  date: string;
  maxTempC: number;
  minTempC: number;
  condition: string;
  precipitationProbPercent: number;
}

// =====================================================
// ITINERARY STRUCTURE
// =====================================================

export type TimeOfDay = "morning" | "afternoon" | "evening";

export interface ItineraryActivity {
  timeOfDay: TimeOfDay;
  timeSlot: string;
  title: string;
  description: string;
  place_id: string;
  placeName: string;
  location: GeoLocation;
  estimatedCost: number;
  durationMinutes: number;
  distanceToNextKm?: number;
  travelTimeToNextMins?: number;
}

export interface ItineraryTransport {
  mode: string;
  estimatedCost: number;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  weatherSummary: DayWeatherSummary;
  accommodation?: CandidateHotel;
  activities: ItineraryActivity[];
  dailyTransport?: ItineraryTransport;
  estimatedDailyCost: number;
}

// =====================================================
// BUDGET BREAKDOWN
// =====================================================

export interface BudgetBreakdown {
  accommodationTotal: number;
  foodTotal: number;
  activitiesTotal: number;
  transportTotal: number;
  contingency: number;
  totalEstimatedCost: number;
  currency: string;
}

// =====================================================
// CUSTOMIZATION LOG
// =====================================================

export interface CustomizationLog {
  instruction: string;
  appliedAt: string;
}

// =====================================================
// TRIP ENTITY
// =====================================================

export interface TripModel {
  trip_id: string;
  user_generated_id: string;
  destinationDetails: DestinationDetails;
  preferences: TripPreferences;
  candidateHotels: CandidateHotel[];
  candidateAttractions: CandidateAttraction[];
  candidateRestaurants: CandidateRestaurant[];
  weatherForecast: DayWeatherSummary[];
  itinerary: ItineraryDay[];
  budgetBreakdown: BudgetBreakdown;
  customizationHistory: CustomizationLog[];
  generationCount: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// USAGE & QUOTA
// =====================================================

export interface TripUsage {
  user_generated_id: string;
  generations_count: number;
  max_allowed: number;
  last_generated_at: string;
}

// =====================================================
// API RESPONSES
// =====================================================

export interface TripApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  usage?: {
    generationsCount: number;
    maxAllowed: number;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
