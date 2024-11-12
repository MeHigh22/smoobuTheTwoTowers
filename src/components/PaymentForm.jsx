import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const PaymentForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe not loaded yet");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Update return URL to include payment_intent parameter
          return_url: `${window.location.origin}/booking-confirmation`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        onError(result.error.message);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // Store booking data in localStorage before redirect
        const bookingData = {
          paymentIntent: result.paymentIntent,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("bookingData", JSON.stringify(bookingData));
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err.message);
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {errorMessage && (
        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#668E73] disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Traitement en cours..." : "Payer maintenant"}
      </button>
    </form>
  );
};

export default PaymentForm;
