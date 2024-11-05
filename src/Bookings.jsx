import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [priceDetails, setPriceDetails] = useState(null);

  const fetchRates = async (apartmentId, startDate, endDate) => {
    if (!apartmentId || !startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await api.get("/rates", {
        params: {
          apartments: [apartmentId],
          start_date: startDate,
          end_date: endDate,
          adults: formData.adults,
          children: formData.children,
        },
      });

      console.log("Rates response:", response.data);

      if (response.data.data && response.data.data[apartmentId]) {
        setDailyRates(response.data.data[apartmentId]);
        setPriceDetails(response.data.priceDetails);

        setFormData((prevData) => ({
          ...prevData,
          price: response.data.priceDetails.finalPrice,
        }));

        setError(null);
      } else {
        setError("No rates found for the selected dates");
        setFormData((prevData) => ({
          ...prevData,
          price: 0,
        }));
        setPriceDetails(null);
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
      setPriceDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.arrivalDate && formData.departureDate) {
      fetchRates(
        formData.apartmentId,
        formData.arrivalDate,
        formData.departureDate
      );
    }
  }, [
    formData.apartmentId,
    formData.arrivalDate,
    formData.departureDate,
    formData.adults,
    formData.children,
  ]);

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
    // Prepare the reservation data
    const reservationData = {
      ...formData,
      price: Number(formData.price),
      adults: Number(formData.adults),
      children: Number(formData.children),
      deposit: Number(formData.deposit),
      // Make sure dates are in the correct format
      arrivalDate: formData.arrivalDate,
      departureDate: formData.departureDate,
      // Add any required fields that Smoobu expects
      priceStatus: 1,
      depositStatus: 1,
      language: "en",
    };

    console.log("Submitting reservation:", reservationData);

    const response = await api.post("/reservations", reservationData);

    console.log("Booking response:", response.data);
    setSuccessMessage("Booking created successfully!");
    setError(null);

    // Optionally reset form or redirect
    // resetForm(); // If you want to reset the form
    // or
    // window.location.href = '/confirmation'; // If you want to redirect
  } catch (err) {
    console.error("Booking error:", err);
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      "An error occurred while creating the booking.";
    setError(errorMessage);

    // Log detailed error information
    if (err.response?.data) {
      console.error("Error details:", err.response.data);
    }
  } finally {
    setLoading(false);
  }
};

  const renderPriceDetails = () => {
    if (!priceDetails) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Price Breakdown:</h3>
        {priceDetails.priceElements.map((element, index) => (
          <div
            key={index}
            className={`flex justify-between items-center ${
              element.type === "longStayDiscount" ? "text-green-600" : ""
            } ${element.amount < 0 ? "text-green-600" : ""}`}
          >
            <span>{element.name}</span>
            <span>
              {Math.abs(element.amount).toFixed(2)} {element.currencyCode}
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200 font-bold flex justify-between items-center">
          <span>Final Price</span>
          <span>{priceDetails.finalPrice.toFixed(2)} EUR</span>
        </div>
        {priceDetails.discount > 0 && (
          <div className="mt-2 text-sm text-green-600">
            Vous économisez {priceDetails.discount.toFixed(2)} avec notre discount
          </div>
        )}
      </div>
    );
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
        <h3 className="font-bold mb-2">Daily Base Rates:</h3>
        <div className="grid grid-cols-2 gap-2">
          {dates.map(({ date, rate }) => (
            <div key={date} className="text-sm">
              {date}: {rate?.price || "N/A"} EUR{" "}
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
            Number of Adults:
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              max="4"
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

        {renderPriceDetails()}
        {renderDailyRates()}

        <button
          type="submit"
          disabled={loading || !formData.price}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Booking..." : "Create Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
