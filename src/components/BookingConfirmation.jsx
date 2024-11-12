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
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="w-12 h-12 mx-auto text-green-600"
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
            <h1 className="mb-4 text-3xl font-bold text-green-600">
              Réservation Confirmée !
            </h1>
            <p className="text-lg text-gray-600">
              Merci pour votre réservation. Un email de confirmation a été
              envoyé à{" "}
              <span className="font-medium">{bookingDetails?.email}</span>
            </p>
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="p-8">
          <div className="space-y-8">
            {/* Accommodation Details */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Détails du séjour</h2>
              <div className="p-6 space-y-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-600">Check-in</p>
                    <p className="font-medium">
                      {formatDate(bookingDetails?.arrivalDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Check-out</p>
                    <p className="font-medium">
                      {formatDate(bookingDetails?.departureDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nombre de personnes</p>
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
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Informations du client
              </h2>
              <div className="p-6 space-y-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-gray-600">Nom</p>
                    <p className="font-medium">
                      {bookingDetails?.firstName} {bookingDetails?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{bookingDetails?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Téléphone</p>
                    <p className="font-medium">{bookingDetails?.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Adresse</p>
                    <p className="font-medium">
                      {bookingDetails?.street}
                      <br />
                      {bookingDetails?.postalCode} {bookingDetails?.location}
                      <br />
                      {bookingDetails?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Détails du prix</h2>
              <div className="p-6 rounded-lg bg-gray-50">
                <div className="space-y-3">
                  {/* Base Price */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix de base</span>
                    <span className="font-medium">
                      {parseFloat(bookingDetails?.basePrice).toFixed(2)}€
                    </span>
                  </div>

                  {/* Extras */}
                  {bookingDetails?.extras?.map((extra, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">
                        {extra.name} (x{extra.quantity})
                      </span>
                      <span className="font-medium">
                        {extra.amount?.toFixed(2)}€
                      </span>
                    </div>
                  ))}

                  {/* Extra Person Fees if any */}
                  {bookingDetails?.extras?.map(
                    (extra, index) =>
                      extra.extraPersonQuantity > 0 && (
                        <div
                          key={`extra-person-${index}`}
                          className="flex justify-between"
                        >
                          <span className="text-gray-600">
                            {extra.name} - Personne supplémentaire (x
                            {extra.extraPersonQuantity})
                          </span>
                          <span className="font-medium">
                            {(
                              extra.extraPersonPrice * extra.extraPersonQuantity
                            ).toFixed(2)}
                            €
                          </span>
                        </div>
                      )
                  )}

                  {/* Total */}
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        {bookingDetails?.priceBreakdown?.totalPrice?.toFixed(2)}
                        €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {bookingDetails?.notice && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Notes supplémentaires
                </h2>
                <div className="p-6 rounded-lg bg-gray-50">
                  <p>{bookingDetails.notice}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#668E73]"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#668E73]"
            >
              Imprimer la confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
