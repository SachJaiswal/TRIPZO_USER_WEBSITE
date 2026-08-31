"use client";

import { useState, useCallback, useEffect } from "react";
import { TripModel, TripUsage } from "../../domain/trip/trip.types";
import { tripApi } from "../../infrastructure/api/tripApi";

export function useUserTrips() {
  const [trips, setTrips] = useState<TripModel[]>([]);
  const [usage, setUsage] = useState<TripUsage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsRes, usageRes] = await Promise.all([
        tripApi.getUserTrips(page, 20, search),
        tripApi.getUserUsage(),
      ]);

      if (tripsRes.success && Array.isArray(tripsRes.data)) {
        setTrips(tripsRes.data);
        if (tripsRes.pagination) {
          setTotalPages(tripsRes.pagination.totalPages);
          setTotalCount(tripsRes.pagination.total);
        }
      }

      if (usageRes.success && usageRes.data) {
        setUsage(usageRes.data);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to load saved travel plans."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const deleteTrip = useCallback(
    async (tripId: string): Promise<boolean> => {
      setIsDeleting(true);
      setError(null);
      try {
        const res = await tripApi.deleteTrip(tripId);
        if (res.success) {
          setTrips((prev) => prev.filter((t) => t.trip_id !== tripId));
          setTotalCount((prev) => Math.max(0, prev - 1));
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete trip plan.");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  return {
    trips,
    usage,
    isLoading,
    isDeleting,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalCount,
    refetch: fetchTrips,
    deleteTrip,
  };
}
