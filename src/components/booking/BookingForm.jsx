// components/booking/BookingForm.jsx
import React from "react";
import { SearchSection } from "./SearchSection";
import { PropertyDetails } from "./PropertyDetails";
import { BookingSteps } from "./BookingSteps";
import { ContactSection } from "./ContactSection";
import { ExtrasSection } from "./ExtrasSection";
import { InfoSupSection } from "./InfoSupSection";
import  PaymentForm  from "../PaymentForm";
import { useBookingForm } from "../hooks/useBookingForm";
import { useAvailabilityCheck } from "../hooks/useAvailabiltyCheck";
import { NavigationButtons } from "./NavigationButtons";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";
import StripeWrapper from "../StripeWrapper";

const BookingForm = () => {
  const {
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
    appliedCoupon,
    selectedCategory,
    setSelectedCategory,
    handleChange,
    handleExtraChange,
    handleCheckAvailability,
    handleSubmit,
    nextStep,
    prevStep,
    isStepValid,
    handlePaymentSuccess,
    setError,
    setStartDate,
    setIsAvailable,
    setEndDate,
    setDateError,
    setCurrentStep,
    setPriceDetails,
    setShowPriceDetails,
    setShowPayment,
    setFormData,
    handleApplyCoupon,

  } = useBookingForm();

  const {
    availableDates,
    loading: availabilityLoading,
    error: availabilityError,
    checkAvailability,
  } = useAvailabilityCheck(formData);

const handleRoomSelect = async (roomId) => {
  // Don't reset everything, just update the apartmentId
  setFormData((prev) => ({
    ...prev,
    apartmentId: roomId,
  }));

  // Check if we have dates and availability data
  if (startDate && endDate) {
    try {
      // If we already have price details, just update the UI
      if (priceDetails && priceDetails[roomId]) {
        setShowPriceDetails(true);
      } else {
        // If we don't have price details for this room, fetch them
        await handleAvailabilityCheck();
      }
    } catch (err) {
      console.error("Error updating prices:", err);
      setError("Failed to update prices for the selected room");
    }
  }

  // Don't reset the step if we're just switching rooms
  // Only reset if we're selecting a room for the first time
  if (!formData.apartmentId) {
    setCurrentStep(1);
  }
};

const handleAvailabilityCheck = async () => {
  if (!startDate || !endDate) {
    setDateError("Please select both arrival and departure dates");
    return;
  }

  setError("");
  setDateError("");

  try {
    console.log("Checking availability with dates:", {
      startDate,
      endDate,
    });

    const availabilityData = await checkAvailability(startDate, endDate);
    console.log("Received availability data:", availabilityData);

    if (availabilityData) {
      if (availabilityData.priceDetails) {
        setPriceDetails(availabilityData.priceDetails);
        setShowPriceDetails(true);
        setIsAvailable(true);
      } else {
        setDateError("No rates available for selected dates");
        setShowPriceDetails(false);
        setIsAvailable(false);
      }
    } else {
      setDateError("No availability found for selected dates");
      setShowPriceDetails(false);
      setIsAvailable(false);
    }
  } catch (err) {
    console.error("Error in availability check:", err);
    setError("Error checking availability");
    setShowPriceDetails(false);
    setIsAvailable(false);
  }
};
 
  const searchSectionProps = {
    formData,
    handleChange,
    startDate,
    endDate,
    handleDateSelect: (date, isStart) => {
      if (!date) {
        if (isStart) {
          setStartDate(null);
          setEndDate(null);
          handleChange({ target: { name: "arrivalDate", value: "" } });
          handleChange({ target: { name: "departureDate", value: "" } });
        } else {
          setEndDate(null);
          handleChange({ target: { name: "departureDate", value: "" } });
        }
        setDateError("");
        return;
      }

      const selectedDate = new Date(date.setHours(12, 0, 0, 0));
      if (isStart) {
        setStartDate(selectedDate);
        setEndDate(null);
        setDateError("");
        handleChange({
          target: {
            name: "arrivalDate",
            value: selectedDate.toISOString().split("T")[0],
          },
        });
        handleChange({ target: { name: "departureDate", value: "" } });
      } else {
        setEndDate(selectedDate);
        setDateError("");
        handleChange({
          target: {
            name: "departureDate",
            value: selectedDate.toISOString().split("T")[0],
          },
        });
      }
    },
    dateError,
    handleCheckAvailability: handleAvailabilityCheck,
  };

  const propertyDetailsProps = {
    formData,
    startDate,
    endDate,
    priceDetails,
    showPriceDetails,
    selectedExtras,
    appliedCoupon,
    onRoomSelect: handleRoomSelect,
    availableDates: availableDates, // Updated to use the correct prop name
    loading: availabilityLoading,
  };

  const extrasSectionProps = {
    selectedExtras,
    handleExtraChange,
    currentStep,
    selectedCategory,
    setSelectedCategory,
  };

  const infoSupSectionProps = {
    formData,
    handleChange,
    appliedCoupon,
    handleApplyCoupon,
  };

  const contactSectionProps = {
    formData,
    handleChange,
    setFormData,
  };

  const navigationButtonsProps = {
    currentStep,
    prevStep,
    nextStep,
    isStepValid,
    loading,
  };

  return (
    <div className="p-6 mx-auto h-[100vh] overflow-y-scroll w-full lg:w-[1024px] xl:w-[1440px]">
      {/* Error and Success Messages */}
      {error && <ErrorMessage message={error} />}
      {availabilityError && <ErrorMessage message={availabilityError} />}
      {successMessage && (
        <div className="mb-4 text-green-500">{successMessage}</div>
      )}
      {(loading || availabilityLoading) && <LoadingSpinner />}

      {!showPayment ? (
        <form onSubmit={handleSubmit} className="mx-auto space-y-4">
          {/* Search Section */}
          <SearchSection {...searchSectionProps} />

          {/* Main Content */}
          <div
            className={`flex flex-col space-y-4 md:flex-row md:space-y-0 ${
              formData.apartmentId ? "md:space-x-4" : ""
            }`}
          >
            {/* Property Details */}
            <div
              className={formData.apartmentId ? "w-full md:w-1/2" : "w-full"}
            >
              <PropertyDetails {...propertyDetailsProps} />
            </div>

            {/* Form Steps */}
            {formData.apartmentId && showPriceDetails && (
              <div className="w-full md:w-1/2 border border-[#668E73] p-4 rounded space-y-4 text-left">
                <h2 className="text-[18px] md:text-[23px] font-normal text-black">
                  {currentStep === 1 && "Extras"}
                  {currentStep === 2 && "Notes"}
                  {currentStep === 3 && "Contact"}
                </h2>

                <BookingSteps currentStep={currentStep} />

                {currentStep === 1 && <ExtrasSection {...extrasSectionProps} />}
                {currentStep === 2 && (
                  <InfoSupSection {...infoSupSectionProps} />
                )}
                {currentStep === 3 && (
                  <ContactSection {...contactSectionProps} />
                )}

                <NavigationButtons {...navigationButtonsProps} />
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="w-2/5 mx-auto mt-8">
          <h3 className="mb-4 text-lg font-medium">Finaliser votre paiement</h3>
          {clientSecret && (
            <StripeWrapper
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={(error) => setError(error)}
            >
              <PaymentForm />
            </StripeWrapper>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingForm;
