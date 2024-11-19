import React from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export const GuestSelect = ({ label, name, value, options, onChange }) => {
  const currentOption =
    options.find((opt) => opt.quantity === String(value)) || options[0];

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[14px] md:text-[16px] font-medium text-[#9a9a9a] mb-1"
      >
        {label}
      </label>
      <Listbox
        value={currentOption}
        onChange={(option) =>
          onChange({ target: { name, value: option.quantity } })
        }
      >
        <div className="relative">
          <Listbox.Button className="mt-1 block w-full rounded border-[#668E73] border text-[14px] md:text-[16px] placeholder:text-[14px] md:placeholder:text-[16px] shadow-sm focus:border-[#668E73] focus:ring-1 focus:ring-[#668E73] text-black bg-white h-12 p-2">
            <span className="flex items-center">
              <span className="block ml-3 truncate">
                {currentOption.quantity}
              </span>
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
              <ChevronUpDownIcon className="text-gray-400 size-5" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `${
                    active ? "bg-[#668E73] text-white" : "text-gray-900"
                  } cursor-default select-none py-2 pl-3 pr-9`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.quantity}
                    </span>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? "text-white" : "text-[#668E73]"
                        }`}
                      >
                        <CheckIcon className="size-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};