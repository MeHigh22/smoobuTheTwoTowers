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

  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingData");
    console.log("Stored booking data:", storedBookingData);

    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        console.log("Parsed booking data:", parsedData);
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

  const API_URL = "https://booking-9u8u.onrender.com";

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

  // Calculate total price components
  const baseWithFees = bookingDetails?.priceDetails[bookingDetails?.apartmentId]?.finalPrice || 0;
  const extrasTotal = bookingDetails?.extras
    ?.filter(extra => !extra.name.includes('supplémentaire'))
    ?.reduce((sum, extra) => sum + extra.amount, 0) || 0;
  const couponDiscount = bookingDetails?.priceDetails?.priceElements
    ?.find(el => el.type === 'coupon')?.amount || 0;
  const finalTotal = baseWithFees + extrasTotal + couponDiscount;

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
      }}
      className="container"
    >
      <div className="card">
        <div className="header">
          <div className="icon-container">
            <img src={logoBaseilles} alt="Logo Baseilles" className="icon" />
          </div>
          <div>
            <h1 className="title">Réservation Confirmée</h1>
            <p className="subtitle">
              Une confirmation a été envoyée à {bookingDetails?.email}
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="details-card">
            <h2 className="titleConfirmation">Détails du séjour</h2>
            <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              {roomsData[bookingDetails?.apartmentId]?.name || "Chambre"}
            </p>
            <p>Check-in: {formatDate(bookingDetails?.arrivalDate)}</p>
            <p>Heure d'arrivée: {bookingDetails?.arrivalTime}</p>
            <p>Check-out: {formatDate(bookingDetails?.departureDate)}</p>
            <p>
              Voyageurs: {bookingDetails?.adults} adultes
              {bookingDetails?.children > 0 &&
                `, ${bookingDetails?.children} enfants`}
            </p>
          </div>

          <div className="details-card">
            <h2 className="titleConfirmation">Détails du prix</h2>
            
            {/* Base Price */}
            <p>Prix de base: {bookingDetails?.priceDetails[bookingDetails?.apartmentId]?.originalPrice?.toFixed(2)}€</p>
            
            {/* Room details */}
            <p>Nombre de nuits: {bookingDetails?.priceDetails[bookingDetails?.apartmentId]?.numberOfNights}</p>
            <p>Prix par nuit: {bookingDetails?.priceDetails[bookingDetails?.apartmentId]?.pricePerNight?.toFixed(2)}€</p>

            {/* Children Fee if applicable */}
            {bookingDetails?.priceDetails[bookingDetails?.apartmentId]?.extraChildrenFee > 0 && (
              <p>
                Frais enfants: {bookingDetails.priceDetails[bookingDetails.apartmentId].extraChildrenFee.toFixed(2)}€
              </p>
            )}

            {/* Room Subtotal */}
            <p className="font-semibold mt-2">
              Sous-total chambre: {baseWithFees.toFixed(2)}€
            </p>

            {/* Extras Section */}
            {bookingDetails?.extras?.length > 0 && (
              <>
                <h3 className="mt-4 mb-2 font-semibold">Extras:</h3>
                {bookingDetails.extras
                  .filter(extra => !extra.name.includes('supplémentaire'))
                  .map((extra, index) => (
                    <p key={index}>
                      {extra.name} (x{extra.quantity}): {extra.amount.toFixed(2)}€
                    </p>
                  ))
                }
                <p className="font-semibold mt-2">
                  Sous-total extras: {extrasTotal.toFixed(2)}€
                </p>
              </>
            )}

            {/* Coupon Discount */}
            {couponDiscount !== 0 && (
              <p className="discount-text mt-2">
                Code promo: {couponDiscount.toFixed(2)}€
              </p>
            )}

            {/* Final Total */}
            <div className="total-section mt-4 pt-4 border-t">
              <p className="total-text font-bold">
                Total final: {finalTotal.toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="details-card">
            <h2 className="titleConfirmation">Adresse</h2>
            <p>{bookingDetails?.street}</p>
            <p>
              {bookingDetails?.postalCode} {bookingDetails?.location}
            </p>
            <p>{bookingDetails?.country}</p>
          </div>
        </div>

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

export default BookingConfirmation;