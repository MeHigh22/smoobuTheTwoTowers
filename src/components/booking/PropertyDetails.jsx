import React from "react";
import { roomsData } from "../hooks/roomsData";
import { isRoomAvailable } from "../hooks/roomUtils";
import { extraCategories } from "../extraCategories";
import { PriceDetails } from "./PriceDetails";
import profileIcon from "../../assets/icons8-group-48.png"
import calendar from "../../assets/icons8-calendar-50.png";


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
  loading,
}) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  // Function to get unavailable dates for a room
  const getUnavailableDatesMessage = (roomId) => {
    if (!availableDates || !availableDates[roomId] || !startDate || !endDate)
      return null;

    const unavailableDates = [];
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayData = availableDates[roomId][dateStr];

      if (!dayData || dayData.available === 0) {
        unavailableDates.push(new Date(dateStr));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (unavailableDates.length > 0) {
      const formatDate = (date) => {
        return date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        });
      };

      return (
        <div className="p-3 mb-4 text-sm text-red-600 rounded-md bg-red-50">
          <span className="font-medium">Dates non disponibles : </span>
          {unavailableDates.map(formatDate).join(", ")}
        </div>
      );
    }

    return null;
  };

  // Sort rooms to put selected room first
  const sortRooms = (rooms) => {
    return [...rooms].sort((a, b) => {
      if (a.id === formData.apartmentId) return -1;
      if (b.id === formData.apartmentId) return 1;
      return 0;
    });
  };

  const groupedRooms = Object.values(roomsData).reduce(
    (acc, room) => {
      if (isRoomAvailable(room.id, startDate, endDate, availableDates)) {
        acc.available.push(room);
      } else {
        acc.unavailable.push(room);
      }
      return acc;
    },
    { available: [], unavailable: [] }
  );

  // Sort both available and unavailable rooms
  groupedRooms.available = sortRooms(groupedRooms.available);
  groupedRooms.unavailable = sortRooms(groupedRooms.unavailable);

  console.log("Grouped rooms:", {
    available: groupedRooms.available.length,
    unavailable: groupedRooms.unavailable.length,
  });

  const RoomCard = ({ room, isAvailable }) => {
    const roomPriceDetails = priceDetails && priceDetails[room.id];

    return (
      <div
        id={`room-${room.id}`}
        className={`p-6 border rounded shadow-sm ${
          isAvailable ? "border-[#668E73]" : "border-gray-300 opacity-75"
        }`}
      >
        {/* Show unavailable dates message for unavailable rooms */}
        {!isAvailable && getUnavailableDatesMessage(room.id)}

        {/* Room Image */}
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-[250px] object-cover rounded-[0.3em] my-4"
        />

        {/* Room Title */}
        <h2 className="text-[18px] md:text-[23px] font-normal text-black mb-2">
          {room.name}
        </h2>
        <p className="text-gray-600">{room.description}</p>

        {/* Capacity and Dates Section */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center space-x-2">
            <img src={profileIcon} alt="Profile Icon" className="w-6 h-6" />
            <span className="text-[16px] text-black">
              Max {room.maxGuests} personnes
            </span>
          </div>
          {formData.apartmentId === room.id && isAvailable && (
            <div className="flex items-center space-x-2">
              <img src={calendar} alt="Calendar Icon" className="w-6 h-6" />
              <span className="text-[16px] text-black">
                {startDate && formatDate(startDate)}
                {(startDate || endDate) && " → "}
                {endDate && formatDate(endDate)}
              </span>
            </div>
          )}
        </div>

        {/* Features and Amenities Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-medium text-[#668E73] mb-3">Features:</h3>
            <ul className="pl-4 space-y-2 text-gray-600 list-disc">
              {room.features.map((feature, index) => (
                <li key={index} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-[#668E73] mb-3">Amenities:</h3>
            <ul className="pl-4 space-y-2 text-gray-600 list-disc">
              {room.amenities.map((amenity, index) => (
                <li key={index} className="text-sm">
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Room Size */}
        <div className="mt-6 text-gray-600">
          <span className="font-medium">Size: </span>
          {room.size}
        </div>

        {/* Select Room Button */}
        <button
          type="button"
          onClick={() => {
            if (isAvailable) onRoomSelect(room.id);
          }}
          disabled={!isAvailable}
          className={`w-full mt-6 py-3 rounded font-medium transition-colors ${
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
          isAvailable &&
          roomPriceDetails && (
            <PriceDetails
              priceDetails={roomPriceDetails}
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
          <h2 className="text-xl font-semibold text-[#668E73] mb-6">
            Chambres disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {groupedRooms.available.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={true} />
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Rooms */}
      {groupedRooms.unavailable.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-500">
            Chambres non disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {groupedRooms.unavailable.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={false} />
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <div className="text-[#668E73]">Chargement...</div>
        </div>
      )}
    </div>
  );
};