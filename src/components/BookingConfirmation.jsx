import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import logoBaseilles from "../assets/logoBaseilles.webp";
import "../assets/bookingConfirmation.css";
import { roomsData } from "./hooks/roomsData";

const BookingConfirmation = () => {
  const [status, setStatus] = useState("loading");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [searchParams] = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  const API_URL = "https://booking-9u8u.onrender.com";

  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingData");
    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        setBookingDetails(parsedData);
        setStatus("success");
        localStorage.removeItem("bookingData");
      } catch (error) {
        console.error("Error parsing booking data:", error);
        setStatus("error");
      }
    } else {
      fetchBookingDetails(paymentIntent);
    }
  }, [paymentIntent]);

  const fetchBookingDetails = async (paymentIntentId) => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/${paymentIntentId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
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
      <div className="container">
        <div className="card">
          <h2>Traitement de votre réservation...</h2>
          <p>Veuillez patienter pendant que nous confirmons votre paiement.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container">
        <div className="card">
          <h2>Une erreur s'est produite lors de la récupération de vos détails de réservation.</h2>
          <p>Veuillez vérifier votre email pour les détails de la réservation ou nous contacter.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center" }}
      className="container"
    >
      <div className="card">
        {/* Success Header */}
        <div className="header">
          <div className="icon-container">
            <img src={logoBaseilles} alt="Logo Baseilles" className="icon" />
          </div>
          <div>
            <h1 className="title">Réservation Confirmée</h1>
            <p className="subtitle">Une confirmation a été envoyée à {bookingDetails?.email}</p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid">
          {/* Stay Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Détails du séjour</h2>
            <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              {roomsData[bookingDetails?.apartmentId]?.name || "Chambre"}
            </p>
            <p>Check-in: {formatDate(bookingDetails?.arrivalDate)}</p>
            <p>Heure d'arrivée: {bookingDetails?.arrivalTime}</p>
            <p>Check-out: {formatDate(bookingDetails?.departureDate)}</p>
            <p>Voyageurs: {bookingDetails?.adults} adultes
              {bookingDetails?.children > 0 && `, ${bookingDetails?.children} enfants`}</p>
          </div>

          {/* Guest Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Informations du client</h2>
            <p>Nom complet: {bookingDetails?.firstName} {bookingDetails?.lastName}</p>
            <p>Email: {bookingDetails?.email}</p>
            <p>Téléphone: {bookingDetails?.phone || "-"}</p>
          </div>

          {/* Price Details */}
          {/* <div className="details-card">
            <h2 className="titleConfirmation">Détails du prix</h2>
            <p>Prix de base: {bookingDetails?.priceBreakdown?.basePrice?.toFixed(2)}€</p>
            
            {bookingDetails?.extras?.map((extra, index) => (
              <p key={index}>
                {extra.name} (x{extra.quantity}): {extra.amount?.toFixed(2)}€
              </p>
            ))}

            {bookingDetails?.priceDetails?.discount > 0 && (
              <p className="discount-text">
                Réduction long séjour ({bookingDetails.priceDetails.settings.lengthOfStayDiscount.discountPercentage}%): 
                -{bookingDetails.priceDetails.discount.toFixed(2)}€
              </p>
            )}

            {bookingDetails?.couponApplied && (
              <p className="discount-text">
                Code promo ({bookingDetails.couponApplied.code}): 
                -{bookingDetails.couponApplied.discount.toFixed(2)}€
              </p>
            )}

            <div className="total-section">
              <p className="total-text">Total: {bookingDetails?.price?.toFixed(2)}€</p>
              <p>Conditions générales: Acceptée</p>
            </div>
          </div> */}

           {/* Price Details */}
          <div className="details-card">
            <h2 className="titleConfirmation">Détails du prix</h2>
            <div className="p-4 mt-4 rounded-lg bg-gray-50" style={{ height: "350px", overflow: "scroll" }}>
              <h3 className="mb-2 font-bold">Détail des prix:</h3>

              {/* Base price */}
              <div className="flex items-center justify-between">
                <span>Prix de base</span>
                <span>{bookingDetails?.priceBreakdown?.basePrice?.toFixed(2)} EUR</span>
              </div>

              {/* Extras */}
              {bookingDetails?.extras?.map((extra, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-gray-600"
                >
                  <span>
                    {extra.name} ({extra.quantity}x)
                  </span>
                  <span>{extra.amount?.toFixed(2)} EUR</span>
                </div>
              ))}

              {/* Long stay discount */}
              {bookingDetails?.priceDetails?.discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>
                    Réduction long séjour (
                    {bookingDetails.priceDetails.settings.lengthOfStayDiscount.discountPercentage}
                    %)
                  </span>
                  <span>-{bookingDetails.priceDetails.discount.toFixed(2)} EUR</span>
                </div>
              )}

              {/* Coupon discount */}
              {bookingDetails?.couponApplied && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Code promo ({bookingDetails.couponApplied.code})</span>
                  <span>-{bookingDetails.couponApplied.discount.toFixed(2)} EUR</span>
                </div>
              )}

              {/* Subtotal before discounts */}
              <div className="flex items-center justify-between pt-2 mt-2 text-gray-600 border-t border-gray-200">
                <span>Sous-total</span>
                <span>{(bookingDetails?.priceBreakdown?.basePrice + (bookingDetails?.extras?.reduce((acc, extra) => acc + extra.amount, 0) || 0)).toFixed(2)} EUR</span>
              </div>

              {/* Total discounts */}
              {(bookingDetails?.priceDetails?.discount > 0 || bookingDetails?.couponApplied) && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Total des réductions</span>
                  <span>-{((bookingDetails?.priceDetails?.discount || 0) + (bookingDetails?.couponApplied?.discount || 0)).toFixed(2)} EUR</span>
                </div>
              )}

              {/* Final total */}
              <div className="flex items-center justify-between pt-2 mt-2 font-bold border-t border-gray-200">
                <span>Total</span>
                <span>{bookingDetails?.price?.toFixed(2)} EUR</span>
              </div>

              {/* Additional information about payment */}
              <div className="mt-4 text-sm text-gray-500">
                <p>* Prix total incluant toutes les taxes et frais</p>
                {bookingDetails?.priceDetails?.settings?.deposit && (
                  <p className="mt-1">
                    ** Acompte requis : {bookingDetails.priceDetails.settings.deposit.percentage}% (
                    {((bookingDetails.price * bookingDetails.priceDetails.settings.deposit.percentage) / 100).toFixed(2)} EUR)
                  </p>
                )}
              </div>
            </div>
          </div>

              {/* Extras */}
              {bookingDetails?.extras?.map((extra, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-gray-600"
                >
                  <span>
                    {extra.name} ({extra.quantity}x)
                  </span>
                  <span>{extra.amount?.toFixed(2)} EUR</span>
                </div>
              ))}

              {/* Long stay discount */}
              {bookingDetails?.priceDetails?.discount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>
                    Réduction long séjour (
                    {bookingDetails.priceDetails.settings.lengthOfStayDiscount.discountPercentage}
                    %)
                  </span>
                  <span>-{bookingDetails.priceDetails.discount.toFixed(2)} EUR</span>
                </div>
              )}

              {/* Coupon discount */}
              {bookingDetails?.couponApplied && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Code promo ({bookingDetails.couponApplied.code})</span>
                  <span>-{bookingDetails.couponApplied.discount.toFixed(2)} EUR</span>
                </div>
              )}

              {/* Subtotal before discounts */}
              <div className="flex items-center justify-between pt-2 mt-2 text-gray-600 border-t border-gray-200">
                <span>Sous-total</span>
                <span>{(bookingDetails?.priceBreakdown?.basePrice + (bookingDetails?.extras?.reduce((acc, extra) => acc + extra.amount, 0) || 0)).toFixed(2)} EUR</span>
              </div>

              {/* Total discounts */}
              {(bookingDetails?.priceDetails?.discount > 0 || bookingDetails?.couponApplied) && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Total des réductions</span>
                  <span>-{((bookingDetails?.priceDetails?.discount || 0) + (bookingDetails?.couponApplied?.discount || 0)).toFixed(2)} EUR</span>
                </div>
              )}

              {/* Final total */}
              <div className="flex items-center justify-between pt-2 mt-2 font-bold border-t border-gray-200">
                <span>Total</span>
                <span>{bookingDetails?.price?.toFixed(2)} EUR</span>
              </div>

          {/* Address */}
          <div className="details-card">
            <h2 className="titleConfirmation">Adresse</h2>
            <p>{bookingDetails?.street}</p>
            <p>{bookingDetails?.postalCode} {bookingDetails?.location}</p>
            <p>{bookingDetails?.country}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button onClick={() => window.location.href = "/"} className="button-primary">
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

export default BookingConfirmation;