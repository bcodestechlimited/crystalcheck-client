import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useAdminActions, useAdminStore } from "../../store/adminStore";
import { useSearchParamsStorage } from "../../hooks/useSearchParamsStorage";
import { BiSolidUserPin } from "react-icons/bi";
import SearchInput from "../../components/SearchInput";
import AdminTable from "./AdminTable";
import Button from "../../components/Button";
import AddAdminModal from "./AddAdminModal";
import { useSearchParams } from "react-router-dom";

export default function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [paramsLoaded, setParamsLoaded] = useState(false);
  const { admins, pagination, isLoading } = useAdminStore();
  const { getAllAdmins } = useAdminActions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const initialParams = Object.fromEntries(searchParams.entries());
    setSearchParams(initialParams);
    getAllAdmins(initialParams);
  }, [searchParams, getAllAdmins]);

  useEffect(() => {
    getAllAdmins(searchParams);
  }, [searchParams, getAllAdmins]);

  useEffect(() => {
    if (paramsLoaded) {
      const params = Object.fromEntries(searchParams.entries());
      if (Object.keys(params).length > 0) {
        getAllAdmins(params);
      } else {
        getAllAdmins({});
      }
    }
  }, [paramsLoaded, searchParams, getAllAdmins]);

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "roles" },
  ];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="mt-4 bg-white border rounded p-5">
      <div className="flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
        <BiSolidUserPin className="text-primary" size={44} />
        <div>
          <p className="text-[16px] font-[500] text-secondary">Admins</p>
          <p className="text-[20px] font-[700] text-secondary">
            {pagination?.totalCount?.toLocaleString() || "0"}
          </p>
        </div>
      </div>
      <div className="py-4 flex items-center justify-between">
        <p className="text-3xl font-semibold text-secondary">
          Admins ({pagination?.totalCount?.toLocaleString() || "0"})
        </p>
        <div className="flex gap-2 relative">
          <SearchInput />

          <Button
            text="Add Admin"
            className="bg-primary p-2 rounded-lg text-white w-40"
            onClick={openModal}
          />
        </div>
        <AddAdminModal
          isOpen={isOpen}
          onClose={closeModal}
          refresh={getAllAdmins}
        />
      </div>

      <AdminTable columns={columns} data={admins} />
      <Pagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
