import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAgentProfile,
  fetchUserLogs,
  fetchUserLogsCount,
} from "../../api/log.api";
import DataTable from "../../components/data-table";

const PAGE_SIZE = 10;

export default function FieldOfficer() {
  const { agentId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const updateSearchParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const { data: officer, isLoading: officerLoading } = useQuery({
    queryKey: ["agentProfile", agentId],
    queryFn: () => fetchAgentProfile({ agentId }),
    enabled: !!agentId,
  });

  const { data: guarantorCount } = useQuery({
    queryKey: ["guarantorCount", agentId, startDate, endDate],
    queryFn: () =>
      fetchUserLogsCount({
        agentId,
        verificationType: "guarantor",
        startDate,
        endDate,
      }),
    enabled: !!agentId,
    select: (res) => res?.count || 0,
  });

  const { data: addressCount } = useQuery({
    queryKey: ["addressCount", agentId, startDate, endDate],
    queryFn: () =>
      fetchUserLogsCount({
        agentId,
        verificationType: "address",
        startDate,
        endDate,
      }),
    enabled: !!agentId,
    select: (res) => res?.count || 0,
  });

  const { data: logsData, isFetching } = useQuery({
    queryKey: ["userLogs", agentId, page, startDate, endDate],
    queryFn: () =>
      fetchUserLogs({ agentId, page, limit: PAGE_SIZE, startDate, endDate }),
    enabled: !!agentId,
    select: (res) => res?.data || { log: [], total: 0 },
  });

  const totalPages = Math.ceil(logsData?.total / PAGE_SIZE) || 1;

  const columns = [
    {
      header: "Verification Type",
      render: (row) => row?.verificationType || "N/A",
    },
    {
      header: "Date",
      render: (row) => {
        const date = new Date(row?.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
  ];

  if (officerLoading) {
    return <div className="p-8 text-center">Loading officer profile...</div>;
  }

  if (!officer) {
    return (
      <div className="p-8 text-center text-red-600">Officer not found.</div>
    );
  }

  return (
    <div className="p-8 mx-auto bg-white border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Field Officer Profile
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="text-lg font-medium text-gray-900">
            {officer.fullName}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium text-gray-900">{officer.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Gender</p>
          <p className="text-lg font-medium text-gray-900">{officer.gender}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="text-lg font-medium text-gray-900">
            {officer.phoneNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 bg-[#F9FAFB] p-6 rounded-lg mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm">Guarantors Verified</p>
          <p className="text-2xl font-semibold text-primary">
            {guarantorCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">Addresses Verified</p>
          <p className="text-2xl font-semibold text-primary">{addressCount}</p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-600 block">Start Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={startDate}
            onChange={(e) =>
              updateSearchParams({ startDate: e.target.value, page: 1 })
            }
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 block">End Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded"
            value={endDate}
            onChange={(e) =>
              updateSearchParams({ endDate: e.target.value, page: 1 })
            }
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logsData?.log || []}
        loading={isFetching}
      />

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => updateSearchParams({ page: page - 1 })}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => updateSearchParams({ page: page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
