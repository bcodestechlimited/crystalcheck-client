import React from "react";
import { Link } from "react-router-dom";
import { fetchUserLogsCount } from "../api/log.api";

const getValue = (obj, path) =>
  path
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : "-"),
      obj
    );

const getStatusClasses = (status) => {
  switch (status.toLowerCase()) {
    case "0/2 verified":
    case "0/2 submitted":
    case "0/2 not match":
      return "bg-red-100 text-red-500 px-2 py-1 rounded-full";
    case "1/2 verified":
    case "1/2 submitted":
      return "bg-purple-200 text-purple-500 px-2 py-1 rounded-full";
    case "2/2 verified":
    case "2/2 submitted":
    case "3/2 verified":
    case "3/2 submitted":
      return "bg-green-200 text-green-500 px-2 py-1 rounded-full";
    default:
      return "bg-gray-200 text-gray-500 px-2 py-1 rounded-full";
  }
};

const getDisplayValue = (column, value) => {
  if (column.accessor === "submittedStatus") {
    return `${value}/2 Submitted`;
  } else if (column.accessor === "status") {
    return `${value}/2 Verified`;
  } else if (column.accessor === "notMatchStatus") {
    return `${value}/2 Not Match`;
  }
  return value;
};

export default function Table({ columns, data, linkPath }) {
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
        {data.map((row, key) => (
          <Link
            to={linkPath}
            key={row?.staff_id || key}
            state={row}
            className="flex hover:bg-sky-50 text-gray-700 text-sm py-2"
          >
            {columns.map((column) => {
              const value = getValue(row, column.accessor);
              const displayValue = getDisplayValue(column, value);
              console.log(row);

              // if (column.accessor === "guarantorsSubmitted") {
              //   displayValue = await fetchUserLogsCount({
              //     userId: row?.staff_id,
              //   });
              // }

              return (
                <div
                  key={column.accessor}
                  className="flex-1 py-1 px-4 text-left whitespace-nowrap overflow-hidden"
                >
                  <span
                    className={`${
                      column.accessor === "status" ||
                      column.accessor === "submittedStatus" ||
                      column.accessor === "notMatchStatus"
                        ? getStatusClasses(displayValue)
                        : ""
                    }`}
                  >
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </Link>
        ))}
      </div>
    </div>
  );
}
