// hooks/useAvailabilityCheck.js
import { useState } from "react";
import { api } from "../utils/api";

export const useAvailabilityCheck = (formData) => {
  const [availableDates, setAvailableDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = async (startDate, endDate) => {
    if (!startDate || !endDate) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const apartmentIds = ["2428698", "2428703", "2432648"];

      console.log("Fetching availability for:", {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        apartmentIds,
      });

      const response = await api.get("/rates", {
        params: {
          apartments: apartmentIds,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          adults: formData.adults || 1,
          children: formData.children || 0,
        },
      });

      console.log("Raw API Response:", response.data);

      if (response.data && response.data.data) {
        setAvailableDates(response.data.data);
        console.log("Set availability data:", response.data.data);
        return response.data.data;
      }

      setError("No availability data found");
      return null;
    } catch (error) {
      console.error("Error fetching availability:", error);
      setError(
        error.response?.data?.error || "Unable to fetch availability data"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    availableDates,
    loading,
    error,
    checkAvailability,
  };
};
