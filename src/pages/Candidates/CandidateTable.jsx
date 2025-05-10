import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

const getValue = (obj, path) =>
  path
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : "-"),
      obj
    );
const getStatusClasses = (status = "") => {
  const normalized = status.toLowerCase();

  if (/^0\/[23] (verified|submitted|not match)$/.test(normalized)) {
    return "bg-red-100 text-red-500 px-2 py-1 rounded-full";
  }

  if (/^(1\/2|2\/3) (verified|submitted)$/.test(normalized)) {
    return "bg-purple-200 text-purple-500 px-2 py-1 rounded-full";
  }

  if (/^(2\/2|3\/3) (verified|submitted)$/.test(normalized)) {
    return "bg-green-200 text-green-500 px-2 py-1 rounded-full";
  }

  return "bg-gray-200 text-gray-500 px-2 py-1 rounded-full";
};

const getDisplayValue = (column, value, totalGuarantors) => {
  if (column.accessor === "submittedStatus") {
    return `${value}/2 Submitted`;
  } else if (column.accessor === "status") {
    return `${value}/${totalGuarantors} Verified`;
  } else if (column.accessor === "notMatchStatus") {
    return `${value}/2 Not Match`;
  }
  return value;
};

export default function CandidateTable({
  columns,
  data,
  linkPath,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
}) {
  const allSelected = data.every((row) => selectedCandidates[row._id]);

  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex text-gray-600 font-semibold text-sm">
        <div className="py-3 px-4 text-left">
          {/* Header checkbox for "Select All" */}
          <input
            type="checkbox"
            checked={allSelected} // Check if all are selected
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4"
          />
        </div>
        {columns.map((column) => (
          <div
            key={column.accessor}
            className="flex-1 py-3 px-4 text-left text-secondary"
            aria-label={column.header}
          >
            {column.header}
          </div>
        ))}
      </div>

      <div className="flex flex-col divide-y">
        {data.map((row, key) => (
          <div
            key={row?._id || key}
            className="flex hover:bg-sky-50 text-gray-700 text-sm py-2"
          >
            {/* Checkbox for each row */}
            <div className="py-1 px-4 text-left">
              <input
                type="checkbox"
                checked={selectedCandidates[row._id] || false}
                onChange={(e) => onSelectCandidate(row._id, e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            {columns.map((column) => {
              const value = getValue(row, column.accessor);
              const totalGuarantors = getValue(row, "totalGuarantors");
              console.log({ totalGuarantors });
              let displayValue = getDisplayValue(
                column,
                value,
                totalGuarantors
              );
              let className = "px-2 py-1";

              if (column.accessor === "agent") {
                displayValue = value?.fullName || "Unassigned";
                className = clsx(
                  className,
                  !value?.fullName && "bg-red-200 text-red-900 rounded-xl"
                );
              }

              if (column.accessor === "addressVerified") {
                displayValue = value === true ? "Yes" : "No";
                className = clsx(
                  className,
                  value === true
                    ? "bg-green-300 rounded-xl"
                    : "bg-red-200 text-red-900 text rounded-xl"
                );
              }

              return (
                <Link
                  to={linkPath}
                  state={row}
                  key={column.accessor}
                  className={`flex-1 py-1 px-4 text-left whitespace-nowrap overflow-hidden`}
                >
                  <span
                    className={`${
                      column.accessor === "status" ||
                      column.accessor === "submittedStatus" ||
                      column.accessor === "notMatchStatus"
                        ? getStatusClasses(displayValue)
                        : className
                    }`}
                  >
                    {displayValue}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
