import React, { useEffect, useRef, useState, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import axiosInstance from "../utils/axios.config";

const SearchableDropdown = ({
  register,
  name,
  validation,
  setValue,
  errors,
  trigger,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (agent) => {
    setSelectedOption(agent.fullName); // Show the name in the dropdown
    setValue(name, agent._id, { shouldValidate: true }); // Use the ID as the value
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleBlur = () => {
    trigger(name);
  };

  // Debounce the search term to limit API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch options dynamically when the debounced search term changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/admin/agents", {
          params: { search: searchTerm, perPage: 5, page: 1 },
        });

        const data = response?.data?.data;
        setAgents(data?.agents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col gap-2" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          onBlur={handleBlur}
          className="w-full p-2 py-2 flex justify-between items-center rounded border border-gray-300 cursor-pointer bg-white"
        >
          <span>{selectedOption || placeholder}</span>
          <FiChevronDown
            className={`transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full p-2 border-b sticky top-0 outline-none"
            />
            {isLoading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : (
              <ul>
                {agents.map((agent) => (
                  <li
                    key={agent?._id}
                    onClick={() => handleSelect(agent)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {agent?.fullName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {errors?.[name] && (
        <p className="text-red-500">{errors?.[name]?.message}</p>
      )}
      <input {...register(name, validation)} type="hidden" />
    </div>
  );
};

export default SearchableDropdown;
