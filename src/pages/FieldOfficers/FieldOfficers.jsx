import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";
import FormModal from "./FormModal";
import SearchInput from "../../components/SearchInput";
import {
  useOfficerActions,
  useOfficerStore,
} from "../../store/useOfficerStore";
import Pagination from "../../components/Pagination";
import { BiSolidUserPin } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

export default function FieldOfficers() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState({});
  const { officers, pagination, isLoading } = useOfficerStore();
  const { getAllOfficers } = useOfficerActions();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync params with URL search params on the first mount
  useEffect(() => {
    const initialParams = Object.fromEntries(searchParams.entries());
    setSearchParams(initialParams);
    // Fetch officers with initial params
    getAllOfficers(initialParams);
  }, [searchParams, getAllOfficers]);

  // Refetch officers when params change
  useEffect(() => {
    getAllOfficers(searchParams);
  }, [searchParams, getAllOfficers]);

  const columns = [
    { header: "FullName", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Gender", accessor: "gender" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "No. Guarantor", accessor: "guarantorsSubmitted" },
    { header: "No. Address", accessor: "addressVerified" },
  ];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="mt-4 bg-white border rounded p-5">
      <div className="flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
        <BiSolidUserPin className="text-primary" size={44} />
        <div>
          <p className="text-[16px] font-[500] text-secondary">
            Field Officers
          </p>
          <p className="text-[20px] font-[700] text-secondary">
            {pagination?.totalCount?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
      <div className="py-4 flex items-center justify-between">
        <p className="text-3xl font-semibold text-secondary">
          Field Officers ({pagination?.totalCount?.toLocaleString() || "0"})
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
      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        refresh={() => getAllOfficers(params)}
      />

      <Table columns={columns} data={officers} />
      <Pagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        isLoading={isLoading}
        onPageChange={(page) => setParams({ ...params, page })}
      />
    </div>
  );
}
