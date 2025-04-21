import React from "react";
import { Link } from "react-router-dom";

const getValue = (obj, path) =>
  path
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : "-"),
      obj
    );

export default function AdminTable({ columns, data, linkPath }) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex text-gray-600 font-semibold text-sm">
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
        {data?.map((row, key) => (
          <div
            key={row?._id || key}
            className="flex hover:bg-sky-50 text-gray-700 text-sm py-2"
          >
            {columns.map((column) => {
              const value = getValue(row, column.accessor);
              let displayValue = value;
              let className = "";

              if (column.accessor === "roles") {
                displayValue = value?.includes("superAdmin")
                  ? "Super Admin"
                  : "Admin";

                className = value?.includes("superAdmin")
                  ? "bg-green-500 text-white px-2"
                  : "";
              }

              return (
                <Link
                  // to={`${linkPath}/${row?._id}`}
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
