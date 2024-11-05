import React, { useState, useEffect } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your-public-stripe-key");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [dailyRates, setDailyRates] = useState({});
  const [priceDetails, setPriceDetails] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Set default dates
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    setFormData((prevData) => ({
      ...prevData,
      arrivalDate: todayStr,
      departureDate: tomorrowStr,
    }));
  }, []);

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
      const reservationData = {
        ...formData,
        price: Number(formData.price),
        adults: Number(formData.adults),
        children: Number(formData.children),
        deposit: Number(formData.deposit),
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        priceStatus: 1,
        depositStatus: 1,
        language: "en",
      };

      const response = await api.post("/reservations", reservationData);
      setSuccessMessage("Booking created successfully!");
      setError(null);

      // Assuming you get a clientSecret from your API for Stripe payment
      setClientSecret(response.data.clientSecret || "");

      // Show payment form if clientSecret exists
      setShowPayment(!!response.data.clientSecret);

    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "An error occurred while creating the booking.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderPriceDetails = () => {
    if (!priceDetails) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Détail des prix:</h3>
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
          <span>Prix final</span>
          <span>{priceDetails.finalPrice.toFixed(2)} EUR</span>
        </div>
      </div>
    );
  };

  const renderBookingForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-4/5 lg:w-3/5 mx-auto">
      <div className="border border-[#668E73] p-4 rounded space-y-4">
        <h2 className="text-[18px] md:text-[20px] font-bold text-[#668E73] text-left">Arrivée</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          {/* Arrival Date */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
              Arrivé
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                placeholder="Select arrival date"
                className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                required
              />
            </label>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
              Départ
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                placeholder="Select departure date"
                className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                required
              />
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
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='green' d='M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5rem 1.5rem",
                }}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
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
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='green' d='M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5rem 1.5rem",
                }}
              >
                {[...Array(11).keys()].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>


      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
    <div className="w-full md:w-1/3 border border-[#668E73] p-4 rounded text-left">
      <h2 className="text-[18px] md:text-[20px] font-bold text-[#668E73]">Info</h2>
    </div>

    <div className="w-full md:w-2/3 border border-[#668E73] p-4 rounded space-y-4 text-left">
      <h2 className="text-[18px] md:text-[20px] font-bold text-[#668E73]">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div>
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

          <button
        type="submit"
        disabled={loading || !formData.price}
        className="w-full py-2 px-4 border border-transparent rounded shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#668E73] disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "En cours..." : "Passer au paiement"}
      </button>

        </div>
      </div>

      {renderPriceDetails()}

    </form>

  );

  const renderPaymentForm = () => (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Complete your payment</h3>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            onSuccess={() => setSuccessMessage("Payment successful!")}
            onError={() => setError("Payment failed. Please try again.")}
          />
        </Elements>
      )}
    </div>
  );

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Réserver le Dôme des Libellules
</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {loading && <p className="text-blue-500 mb-4">Loading...</p>}

      {!showPayment ? renderBookingForm() : renderPaymentForm()}
    </div>
  );
};

export default BookingForm;
