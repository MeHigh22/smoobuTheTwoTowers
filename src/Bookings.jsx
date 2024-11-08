import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";
import StripeWrapper from "./components/StripeWrapper";
import {
  extraCategories,
  calculateExtrasTotal,
} from "./components/extraCategories";

import Calendar from "./assets/icons8-calendar-50.png";
import Group from "./assets/icons8-group-48.png";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51QHmafIhkftuEy3nUnQeADHtSgrHJDHFtkQDfKK7dtkN8XwYw4qImtQTAgGiV0o9TR2m2DZfHhc4VmugNUw0pEuF009YsiV98I"
);

// Create API instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const BookingForm = () => {
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    channelId: 3960043,
    apartmentId: 2402388,
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
    street: "",
    postalCode: "",
    location: "",
    country: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dailyRates, setDailyRates] = useState({});
  const [priceDetails, setPriceDetails] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("meals");
  const [selectedExtras, setSelectedExtras] = useState({});
  const [showExtras, setShowExtras] = useState(false);

  const arrivalDateRef = useRef(null);
  const departureDateRef = useRef(null);

  const openArrivalDatePicker = () => arrivalDateRef.current?.showPicker();
  const openDepartureDatePicker = () => departureDateRef.current?.showPicker();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  const handleExtraChange = (extraId, quantity) => {
    // Prevent event bubbling just in case
    event?.preventDefault?.();
    if (quantity < 0) return;
    setSelectedExtras((prev) => ({
      ...prev,
      [extraId]: quantity,
    }));
  };

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

      if (response.data.data && response.data.data[apartmentId]) {
        setPriceDetails(response.data.priceDetails);
        setFormData((prevData) => ({
          ...prevData,
          price: response.data.priceDetails?.finalPrice || 0,
        }));
        setIsAvailable(true);
        setShowPriceDetails(true);
        setError(null);
      } else {
        setIsAvailable(false);
        setShowPriceDetails(false);
        setError("Aucun tarif trouvé pour les dates sélectionnées");
        setPriceDetails(null);
      }
    } catch (err) {
      setIsAvailable(false);
      setShowPriceDetails(false);
      setError(
        err.response?.data?.error ||
          "Impossible de récupérer les tarifs. Veuillez réessayer plus tard."
      );
      setPriceDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = () => {
    fetchRates(
      formData.apartmentId,
      formData.arrivalDate,
      formData.departureDate
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "arrivalDate" || name === "departureDate") {
      setShowPriceDetails(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price) {
      setError("Veuillez attendre le calcul du prix avant de continuer.");
      return;
    }

    setLoading(true);
    try {
      // Calculate total with extras
      const extrasTotal = calculateExtrasTotal(selectedExtras);
      const totalPrice = Number(formData.price) + extrasTotal;

      // Create array of selected extras for the booking
      const selectedExtrasArray = Object.entries(selectedExtras)
        .filter(([_, quantity]) => quantity > 0)
        .map(([extraId, quantity]) => {
          const extra = Object.values(extraCategories)
            .flatMap((category) => category.items)
            .find((item) => item.id === extraId);
          return {
            type: "addon",
            name: extra.name,
            amount: extra.price * quantity,
            quantity: quantity,
            currencyCode: "EUR",
          };
        });

      console.log("Submitting booking data:", formData);
      const response = await api.post("/create-payment-intent", {
        price: totalPrice,
        bookingData: {
          ...formData,
          price: totalPrice,
          extras: selectedExtrasArray,
          adults: Number(formData.adults),
          children: Number(formData.children),
          deposit: Number(formData.deposit),
        },
      });

      console.log("Payment intent created:", response.data);
      setClientSecret(response.data.clientSecret);
      setShowPayment(true);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSuccessMessage("Paiement réussi ! Votre réservation est confirmée.");
    setShowPayment(false);
  };

  const handlePaymentError = (errorMessage) => {
    setError(`Échec du paiement: ${errorMessage}`);
  };

  const renderPriceDetails = () => {
    if (!priceDetails) return null;

    // Get all selected extras with their details
    const selectedExtrasDetails = Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .map(([extraId, quantity]) => {
        const extra = Object.values(extraCategories)
          .flatMap((category) => category.items)
          .find((item) => item.id === extraId);
        return {
          name: extra.name,
          quantity: quantity,
          price: extra.price,
          total: extra.price * quantity,
        };
      });

    const extrasTotal = selectedExtrasDetails.reduce(
      (sum, extra) => sum + extra.total,
      0
    );
    const finalTotal = priceDetails.finalPrice + extrasTotal;

    return (
      <div className="p-4 mt-4 rounded-lg bg-gray-50">
        <h3 className="mb-2 font-bold">Détail des prix:</h3>

        {/* Base price elements */}
        {priceDetails.priceElements.map((element, index) => (
          <div
            key={index}
            className={`flex justify-between items-center ${
              element.amount < 0 ? "text-green-600" : ""
            }`}
          >
            <span>{element.name}</span>
            <span>
              {Math.abs(element.amount).toFixed(2)} {element.currencyCode}
            </span>
          </div>
        ))}

        {/* Individual extras breakdown */}
        {selectedExtrasDetails.length > 0 && (
          <>
            <div className="mt-4 mb-2 font-medium text-gray-700">
              Extras sélectionnés:
            </div>
            {selectedExtrasDetails.map((extra, index) => (
              <div
                key={index}
                className="flex items-center justify-between pl-4 text-gray-600"
              >
                <span>
                  {extra.name} ({extra.quantity}x {extra.price.toFixed(2)}€)
                </span>
                <span>{extra.total.toFixed(2)} EUR</span>
              </div>
            ))}
          </>
        )}

        {/* Final total */}
        <div className="flex items-center justify-between pt-2 mt-4 font-bold border-t border-gray-200">
          <span>Prix final</span>
          <span>{finalTotal.toFixed(2)} EUR</span>
        </div>

        {/* Show total savings if there are any discounts */}
        {priceDetails.priceElements.some((element) => element.amount < 0) && (
          <div className="mt-2 text-sm text-right text-green-600">
            Vous économisez{" "}
            {Math.abs(
              priceDetails.priceElements
                .filter((element) => element.amount < 0)
                .reduce((total, element) => total + element.amount, 0)
            ).toFixed(2)}{" "}
            EUR
          </div>
        )}
      </div>
    );
  };

  const renderExtrasSection = () => (
    <div className="mt-8">
      {/* Add type="button" to the extras toggle button */}
      <button
        type="button" // Important!
        onClick={() => setShowExtras(!showExtras)}
        className="w-full flex justify-between items-center p-4 bg-[#668E73] bg-opacity-20 rounded-lg text-[#668E73] hover:bg-opacity-30 transition-all"
      >
        <span className="text-[18px] font-normal">Extras</span>
        <svg
          className={`w-6 h-6 transform transition-transform ${
            showExtras ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showExtras && (
        <div className="mt-6 space-y-8">
          {/* Add type="button" to category filter buttons */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(extraCategories).map(([key, category]) => (
              <button
                key={key}
                type="button" // Important!
                onClick={() => setSelectedCategory(key)}
                className={`px-5 py-2 rounded-lg transition-all text-[16px] font-normal ${
                  selectedCategory === key
                    ? "bg-[#668E73] text-white"
                    : "bg-[#668E73] bg-opacity-10 text-[#668E73] hover:bg-opacity-20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {extraCategories[selectedCategory].items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-24 h-24 rounded-lg"
                />
                <div className="flex-grow space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[16px] font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <div className="bg-[#668E73] px-3 py-1 rounded text-white text-[14px] font-medium">
                      {item.price}€
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Add type="button" to the increment/decrement buttons */}
                    <button
                      type="button" // Important!
                      onClick={() =>
                        handleExtraChange(
                          item.id,
                          (selectedExtras[item.id] || 0) - 1
                        )
                      }
                      disabled={(selectedExtras[item.id] || 0) === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#668E73] text-[#668E73] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#668E73] hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 font-medium text-center text-gray-900">
                      {selectedExtras[item.id] || 0}
                    </span>
                    <button
                      type="button" // Important!
                      onClick={() =>
                        handleExtraChange(
                          item.id,
                          (selectedExtras[item.id] || 0) + 1
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#668E73] text-[#668E73] hover:bg-[#668E73] hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentForm = () => (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-medium">Finaliser votre paiement</h3>
      {clientSecret && (
        <StripeWrapper clientSecret={clientSecret}>
          <PaymentForm
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </StripeWrapper>
      )}
    </div>
  );

  return (
    <div className="p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">
        Réserver le Dôme des Libellules
      </h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {successMessage && (
        <p className="mb-4 text-green-500">{successMessage}</p>
      )}
      {loading && <p className="mb-4 text-blue-500">Chargement...</p>}

      {!showPayment ? (
        <form onSubmit={handleSubmit} className="w-full mx-auto space-y-4">
          {/* Search Section */}
          <div className="border border-[#668E73] p-5 rounded space-y-4">
            <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2 lg:grid-cols-5">
              {/* Arrival Date */}
              <div className="relative">
                <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                  Arrivé
                  <div className="relative">
                    <input
                      type="date"
                      name="arrivalDate"
                      value={formData.arrivalDate}
                      onChange={handleChange}
                      ref={arrivalDateRef}
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2 pr-10"
                      required
                    />
                    <img
                      src={Calendar}
                      alt="Calendar Icon"
                      className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                      onClick={openArrivalDatePicker}
                    />
                  </div>
                </label>
              </div>

              {/* Departure Date */}
              <div className="relative">
                <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                  Départ
                  <div className="relative">
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      ref={departureDateRef}
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2 pr-10"
                      required
                    />
                    <img
                      src={Calendar}
                      alt="Calendar Icon"
                      className="absolute w-6 h-6 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                      onClick={openDepartureDatePicker}
                    />
                  </div>
                </label>
              </div>

              {/* Adults Dropdown */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                  Adultes
                  <select
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2 appearance-none"
                    required
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23668E73' d='M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5rem 1.5rem",
                    }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Children Dropdown */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                  Enfants
                  <select
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23668E73' d='M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5rem 1.5rem",
                    }}
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Check Availability Button */}
              <div className="block align-baseline">
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  className="w-full h-12 p-2 mt-7 border rounded shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Left Column - Property Details */}
            <div className="w-full p-4 text-left border rounded md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1720293315632-37efe958d5ec?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Property"
                className="w-[100%] h-[250px] object-cover rounded-[0.3em] mt-4"
              />
              <h2 className="text-[18px] md:text-[23px] font-normal text-black">
                Le dôme des libellules
              </h2>

              {/* Guest Count */}
              <div className="flex items-center justify-between mt-4">
                <img src={Group} alt="Profile Icon" className="w-6 h-6" />
                <span className="text-[16px] font-light text-black">
                  {Number(formData.adults) + Number(formData.children)}{" "}
                  {Number(formData.adults) + Number(formData.children) > 1
                    ? "personnes"
                    : "personne"}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between mt-2 mb-5">
                <img src={Calendar} alt="Calendar Icon" className="w-6 h-6" />
                <div className="flex items-center text-[16px] font-light text-black">
                  {formData.arrivalDate && (
                    <span>{formatDate(formData.arrivalDate)}</span>
                  )}
                  <span className="mx-2 text-black">→</span>
                  {formData.departureDate && (
                    <span>{formatDate(formData.departureDate)}</span>
                  )}
                </div>
              </div>

              <hr />
              {showPriceDetails && renderPriceDetails()}
            </div>

            {/* Right Column - Contact Form */}
            <div className="w-full md:w-2/3 border border-[#668E73] p-4 rounded space-y-4 text-left">
              <h2 className="text-[18px] md:text-[23px] font-normal text-black">
                Contact
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Contact form fields */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Prénom*
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                      required
                    />
                  </label>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Nom*
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                      required
                    />
                  </label>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Email*
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                      required
                    />
                  </label>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Téléphone
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Téléphone"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                    />
                  </label>
                </div>

                {/* Street */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Rue/numéro
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Rue/Numéro"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                    />
                  </label>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Code postal
                    <input
                      type="number"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Code postal"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                    />
                  </label>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Ville
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ville"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                    />
                  </label>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Pays
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Pays"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                    />
                  </label>
                </div>

                {/* Notes */}
                <div className="col-span-full">
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Laissez un message pour le propriétaire
                    <textarea
                      name="notice"
                      value={formData.notice}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Laissez un message pour le propriétaire"
                      className="mt-1 block w-full rounded border-[#668E73] border text-[16px] placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white p-2"
                    />
                  </label>
                </div>
              </div>

              {/* Extras Section */}
              {renderExtrasSection()}

              <button
                type="submit"
                disabled={loading || !formData.price}
                className="w-full py-2 px-4 border border-transparent rounded shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#668E73] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "En cours..." : "Passer au paiement"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        renderPaymentForm()
      )}
    </div>
  );
};

export default BookingForm;