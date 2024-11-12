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
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

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
  const [currentStep, setCurrentStep] = useState(1); // Step state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderProgressBar = () => (
    <div className="flex justify-between items-center mb-4">
      <div className="w-full h-2 bg-gray-300 rounded">
        <div
          className={`h-2 rounded ${
            currentStep === 1 ? "w-1/3" : currentStep === 2 ? "w-2/3" : "w-full"
          } bg-[#668E73]`}
        ></div>
      </div>
      <span className="ml-2 text-sm text-[#668E73]">
        Step {currentStep} of 3
      </span>
    </div>
  );

  const renderContactSection = () => (
    <div>
      <h2 className="text-[18px] md:text-[23px] font-normal text-black">
        Contact
      </h2>
      <div className="mt-6 space-y-8 w-full">
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

                {/* Check-in */}
                <div>
                  <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                    Check-in*
                    <select
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2 appearance-none"
                      required
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='green' d='M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5rem 1.5rem",
                      }}
                    >
                      <option value="">Heure d'arrivée</option>
                      <option value="17:00">17:00</option>
                      <option value="17:30">17:30</option>
                      <option value="18:00">18:00</option>
                      <option value="18:30">18:30</option>
                      <option value="19:00">19:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                      <option value="20:30">20:30</option>
                      <option value="21:00">21:00</option>
                      <option value="21:30">21:30</option>
                      <option value="22:00">22:00</option>
                      <option value="22:30">22:30</option>
                      <option value="23:00">23:00</option>
                    </select>
                  </label>
                </div>

              </div>
        </div>
    </div>
  );

  const renderExtrasSection = () => (
    <div>
      <h2 className="text-[18px] md:text-[23px] font-normal text-black">
        Extras
      </h2>
      <div className="mt-6 space-y-8 w-full">
          <div className="flex flex-wrap gap-3">
            {Object.entries(extraCategories).map(([key, category]) => (
              <button
                key={key}
                type="button"
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  {/* Base quantity selector */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
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
                      type="button"
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
                  {/* Extra person selector - only show if extraPersonPrice exists */}
                  {item.extraPersonPrice && (
                    <div className="mt-2">
                      <p className="text-[14px] text-gray-600 mb-1">
                        Personne supplémentaire (+{item.extraPersonPrice}€/pers)
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleExtraChange(
                              `${item.id}-extra`,
                              (selectedExtras[`${item.id}-extra`] || 0) - 1
                            )
                          }
                          disabled={
                            (selectedExtras[`${item.id}-extra`] || 0) === 0
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#668E73] text-[#668E73] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#668E73] hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 font-medium text-center text-gray-900">
                          {selectedExtras[`${item.id}-extra`] || 0}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleExtraChange(
                              `${item.id}-extra`,
                              (selectedExtras[`${item.id}-extra`] || 0) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#668E73] text-[#668E73] hover:bg-[#668E73] hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );

  const renderInfoSupSection = () => (
    <div>
      <h2 className="text-[18px] md:text-[23px] font-normal text-black">
        Info Supplémentaire
      </h2>
      <div className="mt-6 space-y-8 w-full">
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

              <div className="pt-4 mt-6 border-t border-gray-200">
                <div className="flex items-end gap-4">
                  <div className="flex-grow">
                    <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
                      Code promo
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Entrez votre code promo"
                        className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
                      />
                    </label>
                    {couponError && (
                      <p className="mt-1 text-sm text-red-500">{couponError}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="h-12 px-6 rounded shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 text-sm text-green-600">
                    Code promo {appliedCoupon.code} appliqué : -
                    {appliedCoupon.discount}€
                  </div>
                )}
              </div>
        </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderContactSection();
      case 2:
        return renderExtrasSection();
      case 3:
        return renderInfoSupSection();
      default:
        return null;
    }
  };

  return (
    <div className="p-6 mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Réserver le Dôme des Libellules</h1>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {loading && <p className="mb-4 text-blue-500">Chargement...</p>}
      
      {/* Render progress bar */}
      {renderProgressBar()}

      {/* Render current step content */}
      {renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Précédent
          </button>
        )}
        {currentStep < 3 && (
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 bg-[#668E73] text-white rounded hover:bg-opacity-90"
          >
            Suivant
          </button>
        )}
        {currentStep === 3 && (
          <button
            type="submit"
            className="px-4 py-2 bg-[#668E73] text-white rounded hover:bg-opacity-90"
          >
            Confirmer
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
