import React from "react";
import DatePicker from "react-datepicker";
import { Listbox } from "@headlessui/react";
import { GuestSelect } from "./GuestSelect";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { adultes, childrenOptions } from "../utils/constants";

export const SearchSection = ({
  formData,
  handleChange,
  startDate,
  endDate,
  handleDateSelect,
  handleCheckAvailability,
  dateError,
}) => {
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form refresh
    handleCheckAvailability();
  };

  return (
    <div
      className="w-full text-center"
      style={{ backgroundColor: "#668E73", padding: "40px 20px" }}
    >
      {/* Title */}
      <h1 className="mb-8 text-3xl font-light text-white">
        Sélectionnez vos dates
      </h1>

      {/* Search Form */}
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow">
        <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-5">
          {/* Arrival */}
          <div className="md:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Arrival
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateSelect(date, true)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date().setHours(24, 0, 0, 0)} // This forces tomorrow as minimum
              locale="fr"
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
              className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
              filterDate={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }}
              isClearable={true}
            />
          </div>

          {/* Departure */}
          <div className="md:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Departure
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateSelect(date, false)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
              className="w-full p-2 border border-gray-300 rounded focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73]"
              isClearable={true}
              disabled={!startDate}
            />
          </div>

          {/* Adults */}
          <div className="md:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Adults
            </label>
            <select
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Children */}
          <div className="md:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Children
            </label>
            <select
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73]"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <button
              onClick={handleCheckAvailability}
              type="button"
              className="w-full p-2 bg-[#668E73] text-white rounded hover:bg-[#557963] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoomNavigation = ({ rooms, onRoomSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {rooms.map((room) => (
        <button
          key={room.id}
          type="button"
          onClick={() => onRoomSelect(room.id)}
          className="px-6 py-2 text-white transition-all rounded-full bg-[#ffffff30] hover:bg-white hover:text-[#668E73] border border-[#668E73]"
        >
          {room.name}
        </button>
      ))}
    </div>
  );
};