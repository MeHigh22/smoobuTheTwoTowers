import React, { useState } from "react";
import axios from "axios";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    channelId: 70, // Default channel ID
    apartmentId: "", // User will provide this
    arrivalTime: "",
    departureTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notice: "",
    adults: 1,
    children: 0,
    price: 0,
    priceStatus: 1,
    deposit: 0,
    depositStatus: 1,
    language: "en",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   // Validate dates to ensure arrival date is not in the past
   const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
   if (formData.arrivalDate < today) {
     setError("Arrival date cannot be before today.");
     return;
   }

   const formDataToSubmit = {
     arrivalDate: formData.arrivalDate,
     departureDate: formData.departureDate,
     channelId: formData.channelId,
     apartmentId: formData.apartmentId,
     arrivalTime: formData.arrivalTime,
     departureTime: formData.departureTime,
     firstName: formData.firstName,
     lastName: formData.lastName,
     email: formData.email,
     phone: formData.phone,
     notice: formData.notice,
     adults: formData.adults,
     children: formData.children,
     price: formData.price,
     priceStatus: formData.priceStatus,
     deposit: formData.deposit,
     depositStatus: formData.depositStatus,
     language: formData.language,
   };

   try {
     const response = await axios.post(
       "https://cors-anywhere.herokuapp.com/https://login.smoobu.com/api/reservations",
       formDataToSubmit,
       {
         headers: {
           "Api-Key": "UZFV5QRY0ExHUfJi3c1DIG8Bpwet1X4knWa8rMkj6o", // Your Smoobu API Key
           "Content-Type": "application/json",
           "X-Requested-With": "XMLHttpRequest", // Required header
         },
       }
     );

     console.log("Success:", response.data);
     setSuccessMessage("Booking created successfully!");
     setError(null); // Clear any previous errors
   } catch (err) {
     console.error("Error:", err.response ? err.response.data : err.message);
     setError(err.response ? err.response.data.detail : "An error occurred");
   }
 };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Booking</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <label>
        Arrival Date:
        <input
          type="date"
          name="arrivalDate"
          value={formData.arrivalDate}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Departure Date:
        <input
          type="date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Channel ID:
        <input
          type="number"
          name="channelId"
          value={formData.channelId}
          onChange={handleChange}
        />
      </label>
      <label>
        Apartment ID:
        <input
          type="number"
          name="apartmentId"
          value={formData.apartmentId}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Arrival Time:
        <input
          type="time"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={handleChange}
        />
      </label>
      <label>
        Departure Time:
        <input
          type="time"
          name="departureTime"
          value={formData.departureTime}
          onChange={handleChange}
        />
      </label>
      <label>
        First Name:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Notice:
        <textarea
          name="notice"
          value={formData.notice}
          onChange={handleChange}
        ></textarea>
      </label>
      <label>
        Adults:
        <input
          type="number"
          name="adults"
          value={formData.adults}
          onChange={handleChange}
          min="1"
        />
      </label>
      <label>
        Children:
        <input
          type="number"
          name="children"
          value={formData.children}
          onChange={handleChange}
          min="0"
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
        />
      </label>
      <label>
        Deposit:
        <input
          type="number"
          name="deposit"
          value={formData.deposit}
          onChange={handleChange}
          step="0.01"
        />
      </label>
      <button type="submit">Create Booking</button>
    </form>
  );
};

export default BookingForm;
