// components/booking/PropertyDetails.jsx
import React from "react";
import { PriceDetails } from "./PriceDetails";
import { roomsData } from "../hooks/roomsData";

export const PropertyDetails = ({
  formData,
  startDate,
  endDate,
  priceDetails,
  showPriceDetails,
  selectedExtras,
  appliedCoupon,
  onRoomSelect,
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Object.values(roomsData).map((room) => (
        <div key={room.id} className="p-4 border border-[#668E73] rounded">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-[250px] object-cover rounded-[0.3em] my-4"
          />

          <h2 className="text-[18px] md:text-[23px] font-normal text-black">
            {room.name}
          </h2>

          <p className="mt-2 text-gray-600">{room.description}</p>

          {/* Room capacity and dates */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <img
                src="/icons/group.png"
                alt="Profile Icon"
                className="w-6 h-6"
              />
              <span className="text-[16px] font-light text-black ml-2">
                Max {room.maxGuests} personnes
              </span>
            </div>

            {formData.apartmentId === room.id && (
              <div className="flex items-center text-[16px] font-light text-black">
                <img
                  src="/icons/calendar.png"
                  alt="Calendar Icon"
                  className="w-6 h-6 mr-2"
                />
                {startDate && <span>{formatDate(startDate)}</span>}
                {(startDate || endDate) && <span className="mx-2">→</span>}
                {endDate && <span>{formatDate(endDate)}</span>}
              </div>
            )}
          </div>

          {/* Features and Amenities */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-medium text-[#668E73] mb-2">Features:</h3>
              <ul className="pl-4 list-disc">
                {room.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[#668E73] mb-2">Amenities:</h3>
              <ul className="pl-4 list-disc">
                {room.amenities.map((amenity, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Room size */}
          <div className="mt-4 text-gray-600">
            <span className="font-medium">Size: </span>
            {room.size}
          </div>

          {/* Select Room Button */}
          <button
            type="button" // Add this to prevent form submission
            onClick={(e) => {
              e.preventDefault(); // Add this
              onRoomSelect(room.id);
            }}
            className={`w-full mt-4 py-2 rounded ${
              formData.apartmentId === room.id
                ? "bg-[#445E54] text-white"
                : "bg-[#668E73] text-white hover:bg-opacity-90"
            }`}
          >
            {formData.apartmentId === room.id ? "Sélectionné" : "Sélectionner"}
          </button>

          {/* Price Details */}
          {showPriceDetails && formData.apartmentId === room.id && (
            <PriceDetails
              priceDetails={priceDetails}
              selectedExtras={selectedExtras}
              appliedCoupon={appliedCoupon}
            />
          )}
        </div>
      ))}
    </div>
  );
};
