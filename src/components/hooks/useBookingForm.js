import { useState } from "react";
import { api } from "../utils/api";
import { VALID_COUPONS } from "../utils/coupons";
import { calculateExtrasTotal } from "../utils/booking";
import { extraCategories } from "../extraCategories";
import { useNavigate } from "react-router-dom";

export const useBookingForm = () => {
  // Form State

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    arrivalDate: "",
    departureDate: "",
    channelId: 4106338,
    apartmentId: "",
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
    conditions: false,
  });

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [dateError, setDateError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("packs");

  // Data State
  const [priceDetails, setPriceDetails] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedExtras, setSelectedExtras] = useState({});

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calculateNumberOfNights = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  };

  // Coupon State
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Handlers
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

  const handleExtraChange = (extraId, quantity) => {
    if (quantity < 0) return;
    setSelectedExtras((prev) => ({
      ...prev,
      [extraId]: quantity,
    }));
  };

  const createSelectedExtrasArray = () => {
    // First, gather all base extras with their extra person info
    const extrasMap = new Map();

    Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .forEach(([extraId, quantity]) => {
        const isExtraPerson = extraId.endsWith("-extra");
        const baseExtraId = isExtraPerson
          ? extraId.replace("-extra", "")
          : extraId;

        const extra = Object.values(extraCategories)
          .flatMap((category) => category.items)
          .find((item) => item.id === baseExtraId);

        if (!extra) return;

        if (isExtraPerson) {
          // If this is an extra person entry, add it to the base extra
          const baseExtra = extrasMap.get(baseExtraId);
          if (baseExtra) {
            baseExtra.extraPersonQuantity = quantity;
            baseExtra.extraPersonAmount = extra.extraPersonPrice * quantity;
          }
        } else {
          // This is a base extra
          extrasMap.set(baseExtraId, {
            type: "addon",
            name: extra.name,
            amount: extra.price * quantity,
            quantity: quantity,
            currencyCode: "EUR",
            extraPersonPrice: extra.extraPersonPrice,
            extraPersonQuantity: 0, // Will be updated if there's an extra person
            extraPersonAmount: 0, // Will be updated if there's an extra person
          });
        }
      });

    // Convert the map back to an array
    return Array.from(extrasMap.values());
  };

  const handleCheckAvailability = async () => {
    if (!formData.arrivalDate || !formData.departureDate) {
      setDateError("Please select both dates");
      return;
    }

    const numberOfNights = calculateNumberOfNights(startDate, endDate);
    console.log(`Number of nights: ${numberOfNights}`);
    setLoading(true);
    setError(null);

    try {
      console.log("Checking rates for:", {
        dates: {
          arrival: formData.arrivalDate,
          departure: formData.departureDate,
        },
        guests: {
          adults: formData.adults,
          children: formData.children,
        },
      });

      const response = await api.get("/rates", {
        params: {
          apartments: formData.apartmentId || ["2428698", "2428703", "2432648"],
          start_date: formData.arrivalDate,
          end_date: formData.departureDate,
          adults: formData.adults,
          children: formData.children,
        },
      });

      console.log("Rates response:", response.data);

      if (response.data.priceDetails) {
        setPriceDetails(response.data.priceDetails);
        setShowPriceDetails(true);
        setIsAvailable(true);
      } else {
        setError("No rates available for selected dates");
        setShowPriceDetails(false);
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      setError(error.response?.data?.error || "Unable to fetch rates");
      setShowPriceDetails(false);
      setIsAvailable(false);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if we have a selected room and price details
    const selectedRoomPrice = priceDetails?.[formData.apartmentId];

    if (!selectedRoomPrice) {
      setError("Veuillez attendre le calcul du prix avant de continuer.");
      return;
    }

    setLoading(true);
    try {
      const selectedExtrasArray = Object.entries(selectedExtras)
        .filter(([_, quantity]) => quantity > 0)
        .map(([extraId, quantity]) => {
          const isExtraPerson = extraId.endsWith("-extra");
          const baseExtraId = isExtraPerson
            ? extraId.replace("-extra", "")
            : extraId;
          const extra = Object.values(extraCategories)
            .flatMap((category) => category.items)
            .find((item) => item.id === baseExtraId);

          if (!extra) return null;

          if (isExtraPerson) {
            return {
              type: "addon",
              name: `${extra.name} - Personne supplémentaire`,
              amount: extra.extraPersonPrice * quantity,
              quantity: quantity,
              currencyCode: "EUR",
            };
          }

          return {
            type: "addon",
            name: extra.name,
            amount: extra.price * quantity,
            quantity: quantity,
            currencyCode: "EUR",
            extraPersonPrice: extra.extraPersonPrice,
            extraPersonQuantity: selectedExtras[`${extraId}-extra`] || 0,
          };
        })
        .filter(Boolean);

      // Calculate extras total
      const extrasTotal = selectedExtrasArray.reduce(
        (sum, extra) => sum + extra.amount,
        0
      );

      // Get the base price from price details
      const basePrice = selectedRoomPrice.originalPrice;
      const subtotalBeforeDiscounts = basePrice + extrasTotal;

      // Get discounts
      const longStayDiscount = selectedRoomPrice.discount || 0;
      const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;

      // Calculate final total
      const finalTotal =
        subtotalBeforeDiscounts - longStayDiscount - couponDiscount;

      console.log("Payment calculation:", {
        basePrice,
        extrasTotal,
        subtotalBeforeDiscounts,
        longStayDiscount,
        couponDiscount,
        finalTotal,
      });

      const response = await api.post("/create-payment-intent", {
        price: finalTotal,
        bookingData: {
          ...formData,
          price: finalTotal,
          basePrice: basePrice,
          extras: selectedExtrasArray,
          couponApplied: appliedCoupon
            ? {
                code: appliedCoupon.code,
                discount: couponDiscount,
              }
            : null,
          priceDetails: {
            ...selectedRoomPrice,
            finalPrice: finalTotal,
            calculatedDiscounts: {
              longStay: longStayDiscount,
              coupon: couponDiscount,
            },
          },
        },
      });

      setClientSecret(response.data.clientSecret);
      setShowPayment(true);
      setError(null);
    } catch (err) {
      console.error("Error creating payment:", err);
      setError(
        err.response?.data?.error ||
          "Une erreur s'est produite lors de la création du paiement"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    const selectedExtrasArray = createSelectedExtrasArray();
    const extrasTotal = calculateExtrasTotal(selectedExtrasArray);
    const subtotal = priceDetails.finalPrice + extrasTotal;
    const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
    const finalTotal = subtotal - couponDiscount;

    const bookingData = {
      ...formData,
      extras: selectedExtrasArray,
      priceDetails: priceDetails,
      totalPrice: finalTotal,
    };

    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    const paymentIntent = clientSecret.split("_secret")[0];
    navigate(`/booking-confirmation?payment_intent=${paymentIntent}`);
  };

  // useBookingForm.js
  const handleApplyCoupon = (couponCode) => {
    console.log("handleApplyCoupon called with:", couponCode);
    setCouponError(null);

    if (!couponCode) {
      console.log("No coupon code provided");
      setCouponError("Veuillez entrer un code promo");
      return;
    }

    const couponInfo = VALID_COUPONS[couponCode.toUpperCase()];
    console.log("Found coupon info:", couponInfo);

    if (!couponInfo) {
      console.log("Invalid coupon code");
      setCouponError("Code promo invalide");
      return;
    }

    setAppliedCoupon({
      code: couponCode.toUpperCase(),
      ...couponInfo,
    });
    console.log("Applied coupon:", {
      code: couponCode.toUpperCase(),
      ...couponInfo,
    });

    setPriceDetails((prev) => {
      const newPriceDetails = {
        ...prev,
        priceElements: [
          ...(prev?.priceElements || []),
          {
            type: "coupon",
            name: `Code promo ${couponCode.toUpperCase()}`,
            amount: -couponInfo.discount,
            currencyCode: couponInfo.currency,
          },
        ],
      };
      console.log("Updated price details:", newPriceDetails);
      return newPriceDetails;
    });

    setCoupon("");
  };
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 3:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.arrivalTime &&
          formData.conditions
        );
      case 2:
        return true;
      case 1:
        return true;
      default:
        return false;
    }
  };

  return {
    // Form State
    formData,
    currentStep,
    error,
    loading,
    isAvailable,
    showPriceDetails,
    successMessage,
    priceDetails,
    showPayment,
    clientSecret,
    selectedExtras,
    dateError,
    startDate,
    endDate,
    coupon,
    appliedCoupon,
    couponError,
    selectedCategory,

    // Handlers
    handleChange,
    handleExtraChange,
    handleCheckAvailability,
    handleSubmit,
    handlePaymentSuccess,
    handleApplyCoupon,
    nextStep,
    prevStep,
    isStepValid,
    setError,
    setStartDate,
    setPriceDetails,
    setEndDate,
    setDateError,
    setIsAvailable,
    setSelectedCategory,
    setFormData,
    setCurrentStep,
    setShowPriceDetails,
    setShowPayment,
  };
};
