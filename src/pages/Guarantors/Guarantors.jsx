import React, { useEffect, useState } from "react";
import {
  useGuarantorActions,
  useGuarantorStore,
} from "../../store/guarantorStore";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import { BsPeopleFill } from "react-icons/bs";
import GuarantorsTable from "./GuarantorsTable";
import Button from "../../components/Button";
import AgentSearchModal from "./AgentSearchModal";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Town", accessor: "town" },
  { header: "State", accessor: "stateCode" },
  { header: "Phone Number", accessor: "phone" },
  { header: "Assigned To", accessor: "agent" },
  { header: "Status", accessor: "IsVerified" },
];

export default function Guarantors() {
  const [selectedGuarantors, setSelectedGuarantors] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { guarantors, pagination, isLoading } = useGuarantorStore();
  const { getAllGuarantors, assignGuarantors } = useGuarantorActions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (!params.page) {
      searchParams.set("page", "1");
      searchParams.set("search", "");
      setSearchParams(searchParams);
    }
  }, [setSearchParams, searchParams]);

  useEffect(() => {
    getAllGuarantors(searchParams);
  }, [searchParams, getAllGuarantors]);

  const handleSelectGuarantor = (id, isSelected) => {
    setSelectedGuarantors((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  const handleSelectAll = (isSelected) => {
    const updated = guarantors.reduce((acc, guarantor) => {
      acc[guarantor._id] = isSelected;
      return acc;
    }, {});
    setSelectedGuarantors(updated);
  };

  const handleAssign = async (agentId) => {
    const selectedIds = Object.keys(selectedGuarantors).filter(
      (id) => selectedGuarantors[id]
    );

    if (selectedIds.length < 1) {
      return toast.error("No Guarantor Selected");
    }

    await assignGuarantors(agentId, selectedIds, searchParams, () => {
      setIsOpen(false);
      handleSelectAll(false);
    });
  };

  return (
    <div className="mt-4 bg-white border rounded p-5">
      <div className="flex gap-x-4">
        <div className="flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
          <BsPeopleFill className="text-primary" size={44} />
          <div>
            <p className="text-[16px] font-[500] text-secondary">Guarantors</p>
            <p className="text-[20px] font-[700] text-secondary">
              {pagination?.totalCount?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 flex items-center justify-between">
        <p className="text-3xl text-secondary font-semibold">
          Guarantors ({pagination?.filteredCount?.toLocaleString() || "0"})
        </p>

        <div className="flex gap-2 relative">
          <Button
            text="Assign"
            onClick={() => setIsOpen(true)}
            className="bg-primary text-white px-4 rounded font-semibold"
          />
          <AgentSearchModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            handleAssign={handleAssign}
          />

          <SearchInput />
        </div>
      </div>
      <GuarantorsTable
        columns={columns}
        data={guarantors}
        linkPath={`/partners/ics/guarantors`}
        selectedGuarantors={selectedGuarantors}
        onSelectGuarantor={handleSelectGuarantor}
        onSelectAll={handleSelectAll}
      />
      <Pagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
