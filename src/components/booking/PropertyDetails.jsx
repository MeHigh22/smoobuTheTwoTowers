// components/booking/PropertyDetails.jsx
import React from "react";
import { PriceDetails } from "./PriceDetails";
import { roomsData } from "../hooks/roomsData";
import { isRoomAvailable } from "../hooks/roomUtils";

export const PropertyDetails = ({
  formData,
  startDate,
  endDate,
  priceDetails,
  showPriceDetails,
  selectedExtras,
  appliedCoupon,
  onRoomSelect,
  availableDates,
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

const groupedRooms = Object.values(roomsData).reduce(
  (acc, room) => {
    // Add debugging log
    console.log("Grouping room:", {
      roomId: room.id,
      isAvailable: isRoomAvailable(room.id, startDate, endDate, availableDates),
    });

    if (isRoomAvailable(room.id, startDate, endDate, availableDates)) {
      acc.available.push(room);
    } else {
      acc.unavailable.push(room);
    }
    return acc;
  },
  { available: [], unavailable: [] }
);

console.log("Grouped rooms:", {
  available: groupedRooms.available.length,
  unavailable: groupedRooms.unavailable.length,
});

  const RoomCard = ({ room, isAvailable }) => {
    return (
      <div
        className={`p-4 border rounded ${
          isAvailable ? "border-[#668E73]" : "border-gray-300 opacity-75"
        }`}
      >
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
          {formData.apartmentId === room.id && isAvailable && (
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
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (isAvailable) onRoomSelect(room.id);
          }}
          disabled={!isAvailable}
          className={`w-full mt-4 py-2 rounded ${
            isAvailable
              ? formData.apartmentId === room.id
                ? "bg-[#445E54] text-white"
                : "bg-[#668E73] text-white hover:bg-opacity-90"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {formData.apartmentId === room.id
            ? "Sélectionné"
            : isAvailable
            ? "Sélectionner"
            : "Non disponible"}
        </button>

        {/* Price Details */}
        {showPriceDetails &&
          formData.apartmentId === room.id &&
          isAvailable && (
            <PriceDetails
              priceDetails={priceDetails}
              selectedExtras={selectedExtras}
              appliedCoupon={appliedCoupon}
            />
          )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Available Rooms */}
      {groupedRooms.available.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#668E73] mb-4">
            Chambres disponibles
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groupedRooms.available.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={true} />
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Rooms */}
      {groupedRooms.unavailable.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-500">
            Chambres non disponibles
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {groupedRooms.unavailable.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
