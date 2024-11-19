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
  isDateUnavailable,
  handleCheckAvailability,
  dateError,
}) => {
  return (
    <div className="border border-[#668E73] p-5 rounded space-y-4">
      <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-4 lg:grid-cols-5">
        {/* Arrival Date */}
        <div className="relative">
          <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
            Arrivée
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateSelect(date, true)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
              locale="fr"
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
              className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
              filterDate={(date) => !isDateUnavailable(date, true)}
              isClearable={true}
            />
          </label>
        </div>

        {/* Departure Date */}
        <div className="relative">
          <label className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1">
            Départ
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateSelect(date, false)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              locale="fr"
              dateFormat="dd/MM/yyyy"
              placeholderText="Sélectionnez une date"
              className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2"
              filterDate={(date) => !isDateUnavailable(date, false)}
              isClearable={true}
              disabled={!startDate}
            />
          </label>
        </div>

        {/* Adults Dropdown */}
        <GuestSelect
          label="Adultes"
          name="adults"
          value={formData.adults}
          options={adultes}
          onChange={handleChange}
        />

        {/* Children Dropdown */}
        <GuestSelect
          label="Enfants"
          name="children"
          value={formData.children}
          options={childrenOptions}
          onChange={handleChange}
        />

        {/* Check Availability Button */}
        <div className="block align-baseline">
          <button
            type="button"
            onClick={handleCheckAvailability}
            className="w-full h-12 p-2 mt-7 border rounded shadow-sm text-[16px] font-medium text-white bg-[#668E73] hover:bg-opacity-90 focus:outline-none"
          >
            Rechercher
          </button>
        </div>
      </div>
      {dateError && (
        <div className="mt-2 text-sm font-medium text-red-500">{dateError}</div>
      )}
    </div>
  );
};
