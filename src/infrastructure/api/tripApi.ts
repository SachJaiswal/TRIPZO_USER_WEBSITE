import axiosClient from "./axiosClient";
import {
  TripPreferences,
  TripModel,
  TripUsage,
  TripApiResponse,
} from "../../domain/trip/trip.types";

export const tripApi = {
  /**
   * POST /api/v1/trips/generate
   * Generates a new trip plan using real Google Maps & OpenAI APIs
   */
  async generateTrip(
    preferences: TripPreferences
  ): Promise<TripApiResponse<TripModel>> {
    const response = await axiosClient.post<TripApiResponse<TripModel>>(
      "/api/v1/trips/generate",
      preferences
    );
    return response.data;
  },

  /**
   * GET /api/v1/trips
   * Retrieves all saved trip plans for the current authenticated user
   */
  async getUserTrips(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<TripApiResponse<TripModel[]>> {
    const params: any = { page, limit };
    if (search) params.search = search;

    const response = await axiosClient.get<TripApiResponse<TripModel[]>>(
      "/api/v1/trips",
      { params }
    );
    return response.data;
  },

  /**
   * GET /api/v1/trips/:tripId
   * Retrieves single trip details verifying user ownership
   */
  async getTripById(tripId: string): Promise<TripApiResponse<TripModel>> {
    const response = await axiosClient.get<TripApiResponse<TripModel>>(
      `/api/v1/trips/${tripId}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/trips/:tripId/customize
   * Customizes existing trip itinerary using natural language instructions
   */
  async customizeTrip(
    tripId: string,
    instruction: string
  ): Promise<TripApiResponse<TripModel>> {
    const response = await axiosClient.post<TripApiResponse<TripModel>>(
      `/api/v1/trips/${tripId}/customize`,
      { instruction }
    );
    return response.data;
  },

  /**
   * POST /api/v1/trips/:tripId/regenerate
   * Regenerates trip plan subject to generation limits
   */
  async regenerateTrip(tripId: string): Promise<TripApiResponse<TripModel>> {
    const response = await axiosClient.post<TripApiResponse<TripModel>>(
      `/api/v1/trips/${tripId}/regenerate`
    );
    return response.data;
  },

  /**
   * DELETE /api/v1/trips/:tripId
   * Deletes a trip plan verifying user ownership
   */
  async deleteTrip(
    tripId: string
  ): Promise<TripApiResponse<{ success: boolean; message: string }>> {
    const response = await axiosClient.delete<
      TripApiResponse<{ success: boolean; message: string }>
    >(`/api/v1/trips/${tripId}`);
    return response.data;
  },

  /**
   * GET /api/v1/trips/usage
   * Gets user generation usage count and remaining limit
   */
  async getUserUsage(): Promise<TripApiResponse<TripUsage>> {
    const response = await axiosClient.get<TripApiResponse<TripUsage>>(
      "/api/v1/trips/usage"
    );
    return response.data;
  },
};

export default tripApi;
