import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { roomsData } from "../hooks/roomsData";

// hooks/useAvailabilityCheck.js
export const useAvailabilityCheck = (formData) => {
  const [availableDates, setAvailableDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 12);

        // Get all apartment IDs
        const apartmentIds = ["2428698", "2428703", "2432648"]; // Your actual room IDs

        console.log("Fetching availability for:", {
          apartments: apartmentIds,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        });

        const response = await api.get("/rates", {
          params: {
            apartments: apartmentIds,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
        });

        console.log("Raw response data:", response.data);

        if (response.data && response.data.data) {
          // Transform the data if needed
          const formattedData = Object.keys(response.data.data).reduce(
            (acc, apartmentId) => {
              acc[apartmentId] = response.data.data[apartmentId];
              return acc;
            },
            {}
          );

          console.log("Formatted availability data:", formattedData);
          setAvailableDates(formattedData);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        setError("Unable to fetch availability data");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  return {
    availableDates,
    loading,
    error,
  };
};