import React from "react";
import "../assets/bookingConfirmation.css";


const StaticBookingConfirmation = () => {
  const mockBookingDetails = {
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    arrivalDate: "2024-12-24",
    departureDate: "2024-12-26",
    arrivalTime: "18:00",
    adults: 2,
    children: 1,
    phone: "0123456789",
    street: "123 Main Street",
    postalCode: "1000",
    location: "Brussels",
    country: "Belgium",
    priceBreakdown: {
      basePrice: 400.0,
    },
    extras: [
      {
        name: "L'essentiel (pour 2)",
        quantity: 1,
        amount: 85.0,
      },
      {
        name: "L'essentiel (pour 2) - Personne supplémentaire",
        quantity: 1,
        amount: 20.0,
      },
    ],
    priceDetails: {
      discount: 160.0,
      settings: {
        lengthOfStayDiscount: {
          discountPercentage: 40,
        },
      },
    },
    couponApplied: {
      code: "TESTDISCOUNT",
      discount: 10.0,
    },
    price: 335.0,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-BE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div
      className="container"
      style={{ minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center" }}
    >
      <div className="card">
        {/* Success Header */}
        <div className="header">
          <div className="icon-container">
            <svg
              className="icon"
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
            <h1 className="title">Réservation Confirmée</h1>
            <p className="subtitle">
              Une confirmation a été envoyée à {mockBookingDetails.email}
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid">
          {/* Stay Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Détails du séjour</h2>
            <p>Check-in: {formatDate(mockBookingDetails.arrivalDate)}</p>
            <p>Heure d'arrivée: {mockBookingDetails.arrivalTime}</p>
            <p>Check-out: {formatDate(mockBookingDetails.departureDate)}</p>
            <p>
              Voyageurs: {mockBookingDetails.adults} adultes
              {mockBookingDetails.children > 0 &&
                `, ${mockBookingDetails.children} enfants`}
            </p>
          </div>

          {/* Guest Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Informations du client</h2>
            <p>
              Nom complet: {mockBookingDetails.firstName}{" "}
              {mockBookingDetails.lastName}
            </p>
            <p>Email: {mockBookingDetails.email}</p>
            <p>Téléphone: {mockBookingDetails.phone || "-"}</p>
          </div>

          {/* Price Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Détails du prix</h2>
            <p>
              Prix de base:{" "}
              {mockBookingDetails.priceBreakdown.basePrice.toFixed(2)}€
            </p>
            {mockBookingDetails.extras.map((extra, index) => (
              <p key={index}>
                {extra.name} (x{extra.quantity}): {extra.amount.toFixed(2)}€
              </p>
            ))}
            {mockBookingDetails.priceDetails.discount > 0 && (
              <p>
                Réduction long séjour (
                {
                  mockBookingDetails.priceDetails.settings.lengthOfStayDiscount
                    .discountPercentage
                }
                %): -{mockBookingDetails.priceDetails.discount.toFixed(2)}€
              </p>
            )}
            {mockBookingDetails.couponApplied && (
              <p>
                Code promo ({mockBookingDetails.couponApplied.code}): -
                {mockBookingDetails.couponApplied.discount.toFixed(2)}€
              </p>
            )}
            <p>Total: {mockBookingDetails.price.toFixed(2)}€</p>
          </div>

          {/* Address */}
          <div className="details-card">
            <h2 className="titleConfirmation">Adresse</h2>
            <p>{mockBookingDetails.street}</p>
            <p>
              {mockBookingDetails.postalCode} {mockBookingDetails.location}
            </p>
            <p>{mockBookingDetails.country}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button
            onClick={() => (window.location.href = "/")}
            className="button-primary"
          >
            Retour à l'accueil
          </button>
          <button onClick={() => window.print()} className="button-secondary">
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaticBookingConfirmation;