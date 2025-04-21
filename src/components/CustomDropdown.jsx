import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";

export default function CustomDropdown({
  name,
  label,
  options,
  validation,
  className,
}) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setValue(name, option);
    setIsOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-2 text-left">
      <label className="font-[600] text-[15px] text-[#02052F]" htmlFor={name}>
        {label}
      </label>
      <div
        className={`relative w-full px-3 py-2 border border-gray-300 rounded flex items-center justify-between cursor-pointer ${className} ${
          errors[name] ? "border-red-500" : "border-x-gray-300"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span
          className={`capitalize ${!selectedOption ? "text-gray-400" : ""}`}
        >
          {selectedOption || `Select ${label.toLowerCase()}`}
        </span>
        <FaChevronDown className="text-gray-500" />
      </div>
      {isOpen && (
        <ul className="absolute top-20 left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 overflow-y-auto">
          {options?.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-secondary hover:bg-gray-100 cursor-pointer capitalize"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      <input
        type="hidden"
        {...register(name, validation)}
        value={selectedOption}
      />
      {errors[name] && (
        <span className="text-red-600">{errors[name]?.message}</span>
      )}
    </div>
  );
}
