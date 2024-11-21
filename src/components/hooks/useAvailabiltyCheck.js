import { useState, useEffect } from "react";
import { api } from "../utils/api";

// hooks/useAvailabilityCheck.js
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

        // Get all apartment IDs
        const apartments = [2428698, 2428703, 2432648];

        const response = await api.get("/rates", {
          params: {
            apartments: apartments,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
        });

        console.log('Availability response:', response.data);

        if (response.data.data) {
          setAvailableDates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setError("Unable to fetch availability data");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []); // Remove formData.apartmentId dependency

  const isDateUnavailable = (date, isStart) => {
    if (!date) return true;

    // Block past dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    if (date < tomorrow) return true;

    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const dateStr = localDate.toISOString().split("T")[0];

    // If no specific apartment is selected, check all apartments
    if (!formData.apartmentId) {
      // Allow date selection if at least one apartment is available
      return Object.values(availableDates).every(apartmentData => {
        const dayData = apartmentData[dateStr];
        return !dayData || dayData.available === 0;
      });
    }

    // Check specific apartment
    const apartmentData = availableDates[formData.apartmentId];
    if (!apartmentData) return true;

    const dayData = apartmentData[dateStr];
    if (!dayData) return true;

    if (isStart) {
      // Check if it's a departure day
      const prevDate = new Date(localDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDayStr = prevDate.toISOString().split("T")[0];
      const prevDayData = apartmentData[prevDayStr];

      // If it's a departure day, it's available for new arrivals
      if ((!prevDayData || prevDayData.available === 0) && dayData.available === 1) {
        return false;
      }

      return dayData.available === 0;
    }

    // For departure date selection
    if (formData.arrivalDate) {
      const startDate = new Date(formData.arrivalDate);
      let checkDate = new Date(startDate);

      while (checkDate < date) {
        const checkDateStr = checkDate.toISOString().split("T")[0];
        const checkDayData = apartmentData[checkDateStr];

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