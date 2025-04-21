import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm("");
  }, []);

  const debounceTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value) {
        searchParams.set("search", value);
        searchParams.set("page", 1);
      } else {
        searchParams.delete("search");
      }
      setSearchParams(searchParams);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm("");
    const clearedParams = new URLSearchParams(searchParams);
    clearedParams.delete("search");
    clearedParams.set("page", "1");
    setSearchParams(clearedParams);
  };

  return (
    <div className="flex items-center border rounded-md p-2 shadow-sm w-full max-w-md bg-white">
      <FiSearch className="text-gray-500 mr-2" size={20} />
      <input
        id="search"
        name="search"
        value={searchTerm}
        type="text"
        placeholder="Search..."
        className="w-full outline-none text-gray-700"
        onChange={handleSearch}
      />
      {searchTerm && (
        <FiX
          className="text-gray-500 ml-2 cursor-pointer"
          size={20}
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
