import React, { useState } from "react";
import Slider from "react-slick";
import { roomsData } from "../hooks/roomsData";
import { isRoomAvailable } from "../hooks/roomUtils";
import { PriceDetails } from "./PriceDetails";
import profileIcon from "../../assets/icons8-group-48.png";
import calendar from "../../assets/icons8-calendar-50.png";
import { CalendarWidget } from "./CalendarWidget";
import { CalendarRoom } from "./CalendarRoom";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const getUnavailableDatesMessage = (roomId) => {
    if (!availableDates || !availableDates[roomId] || !startDate || !endDate) return null;

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
      const formatDate = (date) =>
        date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

      return (
        <div className="p-3 mb-4 text-sm text-red-600 rounded-md bg-red-50">
          <span className="font-medium">Dates non disponibles : </span>
          {unavailableDates.map(formatDate).join(", ")}
        </div>
      );
    }

    return null;
  };

  const sortRooms = (rooms) => {
    return [...rooms].sort((a, b) => (a.id === formData.apartmentId ? -1 : 1));
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

  groupedRooms.available = sortRooms(groupedRooms.available);
  groupedRooms.unavailable = sortRooms(groupedRooms.unavailable);

  
  const RoomCard = ({ room, isAvailable }) => {
    const roomPriceDetails = priceDetails && priceDetails[room.id];
  
    const [sliderRef, setSliderRef] = useState(null);
  
    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      asNavFor: sliderRef,
    };
  
    const thumbnailSettings = {
      slidesToShow: 3,
      slidesToScroll: 1,
      focusOnSelect: true,
      infinite: false,
      asNavFor: sliderRef,
    };
  
    return (
      <div
        className={`p-6 border rounded shadow-sm ${
          isAvailable ? "border-[#668E73]" : "border-gray-300"
        }`}
        style={{
          height: formData.apartmentId === room.id ? "80vh" : "fit-content",
        }}
      >
        {!isAvailable && getUnavailableDatesMessage(room.id)}
  
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: Room Slider */}
          <div className="w-full md:w-2/5">
            <h2 className="text-[18px] md:text-[23px] font-normal text-black mb-2">
              {room.name}
            </h2>
  
            {/* Main Image Slider */}
            <Slider {...sliderSettings} ref={(slider) => setSliderRef(slider)}>
              <img
                src={room.images.main}
                alt={`${room.name} Main`}
                className="w-full h-[450px] object-cover"
              />
              <img
                src={room.images.secondary}
                alt={`${room.name} Secondary`}
                className="w-full h-[450px] object-cover"
              />
              <img
                src={room.images.tertiary}
                alt={`${room.name} Tertiary`}
                className="w-full h-[450px] object-cover"
              />
            </Slider>
  
            {/* Thumbnail Slider */}
            <div className="mt-4">
            <Slider {...thumbnailSettings}>
              <img
                src={room.images.main}
                alt={`${room.name} Main Thumbnail`}
                className="object-cover cursor-pointer h-[50px] w-1/3 pr-1"     
                />
              <img
                src={room.images.secondary}
                alt={`${room.name} Secondary Thumbnail`}
                className="object-cover cursor-pointer h-[50px] w-1/3 px-1"
              />
              <img
                src={room.images.tertiary}
                alt={`${room.name} Tertiary Thumbnail`}
                className="object-cover cursor-pointer h-[50px] w-1/3 pl-1"
              />
            </Slider>
          </div>

            {/* Feature Section */}
            <div
              className="features-container overflow-x-auto w-full mt-5"
              style={{ marginTop: "25px" }}
            >
              <div
                className="features-list flex"
                style={{ width: "100%", overflow: "scroll" }}
              >
                {room.features.map((feature, index) => (
                  <div
                    key={index}
                    className="feature-item flex flex-col items-center text-center p-4 bg-[#668E73]"
                    style={{ minWidth: "100px", flex: "0 0 auto" }}
                  >
                    {/* White icon using CSS filter */}
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      style={{
                        height: "30px",
                        width: "30px",
                        filter: "invert(100%)", // Converts the icon color to white
                      }}
                    />
                    {/* White text */}
                    <span className="text-sm mt-2 text-white">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right: Room Details */}
          <div className="w-full md:w-3/5">
            <div className="flex flex-col gap-4">
              {formData.apartmentId === room.id && isAvailable && (
                <>
                  <div className="flex items-center space-x-2">
                    <img
                      src={profileIcon}
                      alt="Profile Icon"
                      style={{ height: "20px", width: "20px", marginRight: "7px" }}
                    />
                    <span className="text-[13px] text-black">
                      Total: {+formData.adults + +formData.children} personnes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={calendar}
                      alt="Calendar Icon"
                      style={{ height: "20px", width: "20px", marginRight: "7px" }}
                    />
                    <span className="text-[13px] text-black">
                      {startDate && formatDate(startDate)}
                      {(startDate || endDate) && " → "}
                      {endDate && formatDate(endDate)}
                    </span>
                  </div>
                </>
              )}
            </div>
  
            <h2 className="text-[18px] md:text-[23px] font-normal text-black mb-2">
              Disponibilités
            </h2>
            {/* {room.calendarIframe && (
              <CalendarWidget calendarIframe={room.calendarIframe} />
            )} */}

            <CalendarRoom/>
  
            <p className="text-gray-600 mb-4">{room.description}</p>

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

          </div>


        </div>
  
  
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
      {groupedRooms.available.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#668E73] mb-6">
            Chambres disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {groupedRooms.available.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={true} />
            ))}
          </div>
        </div>
      )}

      {groupedRooms.unavailable.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-500">
            Chambres non disponibles
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {groupedRooms.unavailable.map((room) => (
              <RoomCard key={room.id} room={room} isAvailable={false} />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="text-[#668E73]">Chargement...</div>
        </div>
      )}
    </div>
  );
};
