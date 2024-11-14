import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const BookingConfirmation = () => {
  const [status, setStatus] = useState("loading");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  useEffect(() => {
    // Try to get booking data from localStorage
    const storedBookingData = localStorage.getItem("bookingData");

    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        console.log("Booking Details from localStorage:", parsedData); // Ajoutez ce log
        setBookingDetails(parsedData);
        setStatus("success");
        // Clear the data from localStorage after retrieving it
        localStorage.removeItem("bookingData");
      } catch (error) {
        console.error("Error parsing booking data:", error);
        setStatus("error");
      }
    } else {
      // If no data in localStorage, try to fetch from API
      fetchBookingDetails(paymentIntent);
    }
  }, [paymentIntent]);

  const fetchBookingDetails = async (paymentIntentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/bookings/${paymentIntentId}`
      );
      const data = await response.json();
      console.log("Booking Details from API:", data); // Ajoutez ce log
      if (data.error) {
        throw new Error(data.error);
      }
      setBookingDetails(data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setStatus("error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-BE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center animate-pulse">
          <h2 className="text-xl font-semibold">
            Traitement de votre réservation...
          </h2>
          <p className="mt-2 text-gray-600">
            Veuillez patienter pendant que nous confirmons votre paiement.
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">
            Une erreur s'est produite lors de la récupération de vos détails de
            réservation.
          </h2>
          <p className="mt-2">
            Veuillez vérifier votre email pour les détails de la réservation ou
            nous contacter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
        {/* Success Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Réservation Confirmée
            </h1>
            <p className="text-gray-600">
              Une confirmation a été envoyée à {bookingDetails?.email}
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Stay Details */}
          <div className="p-6 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white border border-gray-100">
            <h2 className="mb-4 text-lg font-semibold">Détails du séjour</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">
                    {formatDate(bookingDetails?.arrivalDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heure d'arrivée</p>
                  <p className="font-medium">{bookingDetails?.arrivalTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">
                    {formatDate(bookingDetails?.departureDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Voyageurs</p>
                  <p className="font-medium">
                    {bookingDetails?.adults} adultes
                    {bookingDetails?.children > 0 &&
                      `, ${bookingDetails?.children} enfants`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
            <h2 className="mb-4 text-lg font-semibold">
              Informations du client
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="font-medium">
                  {bookingDetails?.firstName} {bookingDetails?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{bookingDetails?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="font-medium">{bookingDetails?.phone || "-"}</p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
            <h2 className="mb-4 text-lg font-semibold">Détails du prix</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Prix de base</span>
                <span className="font-medium">
                  {bookingDetails?.priceBreakdown?.basePrice?.toFixed(2)}€
                </span>
              </div>

              {bookingDetails?.extras?.map((extra, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-500">
                    {extra.name} (x{extra.quantity})
                  </span>
                  <span className="font-medium">
                    {extra.amount?.toFixed(2)}€
                  </span>
                </div>
              ))}

              {bookingDetails?.priceDetails?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Réduction long séjour (
                    {
                      bookingDetails.priceDetails.settings.lengthOfStayDiscount
                        .discountPercentage
                    }
                    %)
                  </span>
                  <span>
                    -{bookingDetails.priceDetails.discount.toFixed(2)}€
                  </span>
                </div>
              )}

              {bookingDetails?.couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Code promo ({bookingDetails.couponApplied.code})</span>
                  <span>
                    -{bookingDetails.couponApplied.discount.toFixed(2)}€
                  </span>
                </div>
              )}

              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{bookingDetails?.price?.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-6 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-white">
            <h2 className="mb-4 text-lg font-semibold">Adresse</h2>
            <p className="space-y-1">
              <span className="block">{bookingDetails?.street}</span>
              <span className="block">
                {bookingDetails?.postalCode} {bookingDetails?.location}
              </span>
              <span className="block">{bookingDetails?.country}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 rounded-lg bg-[#668E73] text-white hover:bg-opacity-90 transition-all"
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 transition-all border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
