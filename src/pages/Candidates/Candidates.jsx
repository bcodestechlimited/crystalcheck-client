import React, { useEffect, useState } from "react";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import FilterModal from "../../components/FilterModal";
import { BsPeopleFill } from "react-icons/bs";
import CandidateTable from "./CandidateTable";
import AgentSearchModal from "../Guarantors/AgentSearchModal";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const columns = [
  { header: "Surname", accessor: "data.surname" },
  { header: "First Name", accessor: "data.firstname" },
  { header: "Staff ID", accessor: "staff_id" },
  { header: "Address Verified", accessor: "addressVerified" },
  { header: "AssignedTo", accessor: "agent" },
  // { header: "Submitted", accessor: "submittedStatus" },
  { header: "Guarantors Verified", accessor: "status" },
  // { header: "Not Match", accessor: "notMatchStatus" },
];

export default function Candidates() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { candidates, pagination, isLoading } = useCandidateStore();
  const { getAllCandidates, assignCandidates } = useCandiateActions();
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
    getAllCandidates(searchParams);
  }, [searchParams, getAllCandidates]);

  const handleSelectCandidate = (id, isSelected) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [id]: isSelected,
    }));
  };

  const handleSelectAll = (isSelected) => {
    const updated = candidates.reduce((acc, guarantor) => {
      acc[guarantor._id] = isSelected;
      return acc;
    }, {});
    setSelectedCandidates(updated);
  };

  const handleAssign = async (agentId) => {
    const selectedIds = Object.keys(selectedCandidates).filter(
      (id) => selectedCandidates[id]
    );

    if (selectedIds.length < 1) {
      return toast.error("No Candidate Selected");
    }

    await assignCandidates(agentId, selectedIds, searchParams, () => {
      setIsOpen(false);
      handleSelectAll(false);
    });
  };

  const handleApplyFilters = (filters) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });
    setSearchParams(updatedParams);
  };

  return (
    <div className="mt-4 bg-white border rounded p-5">
      <div className="flex gap-x-4">
        <div className=" flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
          <BsPeopleFill className="text-primary" size={44} />
          <div>
            <p className="text-[16px] font-[500] text-secondary">Candidates</p>
            <p className="text-[20px] font-[700] text-secondary">
              {pagination?.totalCount?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 flex items-center justify-between">
        <p className=" text-3xl text-secondary font-semibold">
          Candidates ({pagination?.filteredCount?.toLocaleString() || "0"})
        </p>

        <div className=" flex gap-2 relative">
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
          <Button
            text="Filter"
            className="bg-primary p-2 rounded-lg text-white"
            onClick={() => setIsFilterModalOpen(true)}
          />
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleApplyFilters}
          />
        </div>
      </div>
      <CandidateTable
        columns={columns}
        data={candidates}
        linkPath="/partners/ics/candidates/details"
        selectedCandidates={selectedCandidates}
        onSelectCandidate={handleSelectCandidate}
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
