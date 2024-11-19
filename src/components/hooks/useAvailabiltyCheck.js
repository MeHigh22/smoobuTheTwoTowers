import { useState, useEffect } from "react";
import { api } from "../utils/api";

export const useAvailabilityCheck = (formData) => {
  const [availableDates, setAvailableDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 12);

        const response = await api.get("/rates", {
          params: {
            apartments: [formData.apartmentId],
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
        });

        if (response.data.data && response.data.data[formData.apartmentId]) {
          setAvailableDates(response.data.data[formData.apartmentId]);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setError("Unable to fetch availability data");
      } finally {
        setLoading(false);
      }
    };

    if (formData.apartmentId) {
      fetchAvailability();
    }
  }, [formData.apartmentId]);

  const isDateUnavailable = (date, isStart) => {
    if (!date) return true;

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    const dateStr = localDate.toISOString().split("T")[0];
    const dayData = availableDates[dateStr];

    // Block today and past dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (date < tomorrow) return true;

    if (isStart) {
      if (!dayData) return true;

      // Check if it's a departure day
      const prevDate = new Date(localDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevLocalDate = new Date(
        prevDate.getTime() - prevDate.getTimezoneOffset() * 60000
      );
      const prevDayStr = prevLocalDate.toISOString().split("T")[0];
      const prevDayData = availableDates[prevDayStr];

      // If it's a departure day, it's available for new arrivals
      if (
        (!prevDayData || prevDayData.available === 0) &&
        dayData.available === 1
      ) {
        return false;
      }

      // For non-departure days, check if the day is available
      return dayData.available === 0;
    }

    // For departure date selection
    const startDate = new Date(formData.arrivalDate);
    if (startDate) {
      let checkDate = new Date(startDate);

      // Check all dates between start and end (exclusive of end date)
      while (checkDate < date) {
        const checkLocalDate = new Date(
          checkDate.getTime() - checkDate.getTimezoneOffset() * 60000
        );
        const checkDateStr = checkLocalDate.toISOString().split("T")[0];
        const checkDayData = availableDates[checkDateStr];

        if (checkDate.getTime() !== startDate.getTime()) {
          if (!checkDayData || checkDayData.available === 0) {
            return true;
          }
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }

    return false;
  };

  return {
    availableDates,
    isDateUnavailable,
    loading,
    error,
  };
};
