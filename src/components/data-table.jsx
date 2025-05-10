import React from "react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function DataTable({
  columns,
  data,
  isLoading = false,
  noDataMessage = "No data available.",
  pagination,
  rowLink, // function: (row) => string
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-4 text-center">{noDataMessage}</div>;
  }

  console.log({ pagination });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => {
            const link = typeof rowLink === "function" ? rowLink(row) : null;
            const RowContent = (
              <>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render(row)}
                  </td>
                ))}
              </>
            );

            return (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${link ? "cursor-pointer" : ""}`}
              >
                {link ? (
                  <Link to={link} className="contents">
                    {RowContent}
                  </Link>
                ) : (
                  RowContent
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pagination && <CustomPagination pagination={pagination} />}
    </div>
  );
}
