import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    channelId: 2323525,
    apartmentId: 1946276,
    arrivalTime: "",
    departureTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notice: "",
    adults: 1,
    children: 0,
    price: "",
    priceStatus: 1,
    deposit: 0,
    depositStatus: 1,
    language: "en",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dailyRates, setDailyRates] = useState({});

  const fetchRates = async (apartmentId, startDate, endDate) => {
    if (!apartmentId || !startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://cors-anywhere.herokuapp.com/https://login.smoobu.com/api/rates`,
        {
          headers: {
            "Api-Key": "UZFV5QRY0ExHUfJi3c1DIG8Bpwet1X4knWa8rMkj6o",
            "Content-Type": "application/json",
          },
          params: {
            apartments: [apartmentId],
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      console.log("Rates response:", response.data);

      // Store the daily rates for the apartment
      if (response.data.data && response.data.data[apartmentId]) {
        setDailyRates(response.data.data[apartmentId]);

        // Calculate total price for the stay
        const totalPrice = calculateTotalPrice(
          response.data.data[apartmentId],
          startDate,
          endDate
        );

        setFormData((prevData) => ({
          ...prevData,
          price: totalPrice,
        }));

        setError(null);
      } else {
        setError("No rates found for the selected dates");
        setFormData((prevData) => ({
          ...prevData,
          price: 0,
        }));
      }
    } catch (err) {
      console.error("Error fetching rates:", err);
      setError("Could not fetch rates. Please try again later.");
      setFormData((prevData) => ({
        ...prevData,
        price: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (rates, startDate, endDate) => {
    if (!rates || !startDate || !endDate) return 0;

    let totalPrice = 0;
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate < endDateTime) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayRate = rates[dateStr];

      if (dayRate && dayRate.price !== null && dayRate.available === 1) {
        totalPrice += dayRate.price;
      } else {
        // If any day is unavailable or has no price, return 0
        setError(
          "Some dates in your selection are not available or don't have prices set"
        );
        return 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalPrice;
  };

  // Fetch rates when dates change
  useEffect(() => {
    if (formData.arrivalDate && formData.departureDate) {
      fetchRates(
        formData.apartmentId,
        formData.arrivalDate,
        formData.departureDate
      );
    }
  }, [formData.apartmentId, formData.arrivalDate, formData.departureDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price) {
      setError("Please wait for the price calculation before submitting.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.arrivalDate < today) {
      setError("Arrival date cannot be before today.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://cors-anywhere.herokuapp.com/https://login.smoobu.com/api/reservations",
        {
          ...formData,
          price: Number(formData.price),
          adults: Number(formData.adults),
          children: Number(formData.children),
          deposit: Number(formData.deposit),
        },
        {
          headers: {
            "Api-Key": "UZFV5QRY0ExHUfJi3c1DIG8Bpwet1X4knWa8rMkj6o",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      console.log("Booking response:", response.data);
      setSuccessMessage("Booking created successfully!");
      setError(null);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.detail ||
          "An error occurred while creating the booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDailyRates = () => {
    if (
      !formData.arrivalDate ||
      !formData.departureDate ||
      !Object.keys(dailyRates).length
    ) {
      return null;
    }

    const dates = [];
    let currentDate = new Date(formData.arrivalDate);
    const endDate = new Date(formData.departureDate);

    while (currentDate < endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dates.push({
        date: dateStr,
        rate: dailyRates[dateStr],
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (
      <div className="mt-4">
        <h3 className="font-bold mb-2">Daily Rates:</h3>
        <div className="grid grid-cols-2 gap-2">
          {dates.map(({ date, rate }) => (
            <div key={date} className="text-sm">
              {date}: {rate?.price || "N/A"}{" "}
              {rate?.available === 1 ? "(Available)" : "(Unavailable)"}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>Create Booking</h2>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {loading && <p>Loading...</p>}

      <div className="space-y-2">
        <label className="block">
          Arrival Date:
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            className="block w-full mt-1"
            required
          />
        </label>

        <label className="block">
          Departure Date:
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            className="block w-full mt-1"
            required
          />
        </label>

        <label className="block">
          Total Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            readOnly
            className="block w-full mt-1 bg-gray-100"
          />
        </label>

        {renderDailyRates()}
      </div>

      <button
        type="submit"
        disabled={loading || !formData.price}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {loading ? "Creating Booking..." : "Create Booking"}
      </button>
    </form>
  );
};

export default BookingForm;
