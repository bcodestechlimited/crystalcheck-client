import React from "react";
import { Link } from "react-router-dom";

const getValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

export default function GuarantorsTable({
  columns,
  data,
  linkPath,
  selectedGuarantors,
  onSelectGuarantor,
  onSelectAll,
}) {
  const allSelected = data.every((row) => selectedGuarantors[row._id]);

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
                checked={selectedGuarantors[row._id] || false}
                onChange={(e) => onSelectGuarantor(row._id, e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            {columns.map((column) => {
              const value = getValue(row, column.accessor);
              let displayValue = value;
              let className = "";

              if (column.accessor === "agent") {
                displayValue = value?.fullName || "Unassigned";
                className = value?.fullName ? "" : "bg-red-300 text-red-950 px-2";
              }

              if (column.accessor === "IsVerified") {
                displayValue = row?.isVerified
                  ? "Verified"
                  : row?.isSubmitted
                  ? "Submitted"
                  : "Pending";

                className = row?.isVerified
                  ? `bg-green-100 text-green-500`
                  : row?.notMatch
                  ? "bg-red-100 text-red-500"
                  : row?.isSubmitted
                  ? `bg-purple-100 text-purple-500`
                  : "bg-orange-100 text-yellow-500";

                className += " px-2";
              }

              // console.log(row);

              return (
                <Link
                  to={`${linkPath}/${row?._id}`}
                  state={row}
                  key={column.accessor}
                  className={`flex-1 py-1 text-left whitespace-nowrap overflow-hidden`}
                >
                  <div
                    key={column.accessor}
                    className="flex-1 py-1 px-4 text-left whitespace-nowrap overflow-hidden"
                  >
                    <span
                      className={`text-gray-500 py-1 rounded-full ${className} `}
                    >
                      {displayValue}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
