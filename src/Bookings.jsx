import React, { useState, useEffect } from "react";
import axios from "axios";

// Create an axios instance with the backend URL
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

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
      const response = await api.get("/rates", {
        params: {
          apartments: [apartmentId],
          start_date: startDate,
          end_date: endDate,
        },
      });

      console.log("Rates response:", response.data);

      if (response.data.data && response.data.data[apartmentId]) {
        setDailyRates(response.data.data[apartmentId]);

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
      setError(
        err.response?.data?.error ||
          "Could not fetch rates. Please try again later."
      );
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
        setError(
          "Some dates in your selection are not available or don't have prices set"
        );
        return 0;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalPrice;
  };

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
      const response = await api.post("/reservations", {
        ...formData,
        price: Number(formData.price),
        adults: Number(formData.adults),
        children: Number(formData.children),
        deposit: Number(formData.deposit),
      });

      console.log("Booking response:", response.data);
      setSuccessMessage("Booking created successfully!");
      setError(null);
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.error ||
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
      <h2 className="text-2xl font-bold mb-4">Create Booking</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Arrival Date:
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Departure Date:
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Adults:
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Children:
            <input
              type="number"
              name="children"
              value={formData.children}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes:
            <textarea
              name="notice"
              value={formData.notice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Total Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              readOnly
              className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
            />
          </label>
        </div>

        {renderDailyRates()}
      </div>

      <button
        type="submit"
        disabled={loading || !formData.price}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Booking..." : "Create Booking"}
      </button>
    </form>
  );
};

export default BookingForm;
