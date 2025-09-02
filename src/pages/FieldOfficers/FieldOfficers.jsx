import { useState } from "react";
import Button from "../../components/Button";
import FormModal from "./FormModal";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import { BiSolidUserPin } from "react-icons/bi";
import { Link, useSearchParams } from "react-router-dom";
import DataTable from "../../components/data-table";
import { FaChevronDown, FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllAgents } from "../../api/agent.api";

export default function FieldOfficers() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || ""; 

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-agents", { page, perPage, search, status }],
    queryFn: () => getAllAgents({ page, perPage, search, status }),
  });

  console.log({ data });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOptionsOpen(false);

    const lowerCaseOption = option.toLowerCase();

    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (lowerCaseOption === "all") {
        newParams.delete("status");
      } else {
        newParams.set("status", lowerCaseOption);
      }
      return newParams;
    });
  };

  const columns = [
    {
      header: "Full Name",
      render: (row) => row?.fullName || "N/A",
    },
    {
      header: "Email",
      render: (row) => row?.email || "N/A",
    },
    {
      header: "Gender",
      render: (row) => row?.gender || "N/A",
    },
    {
      header: "Phone Number",
      render: (row) => row?.PhoneNumber || "N/A",
    },
    {
      header: "Active",
      render: (row) => {
        return (
          <span
            className={`px-4 py-1 rounded-full ${
              row?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row?.isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "No. Guarantor",
      render: (row) =>
        (
          <Link to={`/field-officers/${row._id}`} className="cursor-pointer">
            {row?.guarantorsSubmitted}
          </Link>
        ) || "N/A",
    },
    {
      header: "No. Address",
      render: (row) =>
        (
          <Link to={`/field-officers/${row._id}`} className=" cursor-pointer">
            {row?.addressVerified}
          </Link>
        ) || "N/A",
    },
  ];

  return (
    <div className="mt-4 bg-white border rounded p-5">
      <div className="flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
        <BiSolidUserPin className="text-primary" size={44} />
        <div>
          <p className="text-[16px] font-[500] text-secondary">
            Field Officers
          </p>
          <p className="text-[20px] font-[700] text-secondary">
            {data?.pagination?.totalCount?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
      <div className="py-4 flex items-center justify-between">
        <p className="text-3xl font-semibold text-secondary">
          Field Officers (
          {data?.pagination?.totalCount?.toLocaleString() || "0"})
        </p>
        <div className="flex gap-2 relative">
          <SearchInput />

          <Button
            text="Add Officers"
            className="bg-primary p-2 rounded-lg text-white w-40"
            onClick={openModal}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative">
          <div
            className={`relative min-w-[200px] max-w-[200px] px-3 py-1 mb-4 border border-gray-300 rounded-lg font-semibold flex items-center justify-between cursor-pointer`}
            onClick={() => setIsOptionsOpen((prev) => !prev)}
          >
            <span
              className={`capitalize ${!selectedOption ? "text-gray-400" : ""}`}
            >
              {status || selectedOption || "All"}
            </span>
            <FaChevronDown className="text-gray-500" />
          </div>
          {isOptionsOpen && (
            <ul className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-y-auto ">
              {["All", "Active", "Inactive"].map((option, index) => (
                <li
                  key={index}
                  className=" flex items-center justify-between px-4 py-2 font-semibold text-secondary hover:bg-gray-100 cursor-pointer capitalize"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                  {selectedOption === option && (
                    <FaCheckCircle className="text-primary" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        refresh={() => refetch({ page: 1, perPage, search, status })}
      />

      <DataTable
        columns={columns}
        data={data?.officers || []}
        noDataMessage="No data available."
        rowLink={(row) => `/field-officers/${row._id}`}
      />
      <Pagination
        totalPages={data?.pagination?.totalPages || 1}
        currentPage={data?.pagination?.currentPage || 1}
        isLoading={isLoading}
        onPageChange={(page) => {
          setSearchParams((prev) => ({ ...prev, page }));
        }}
      />
    </div>
  );
}
