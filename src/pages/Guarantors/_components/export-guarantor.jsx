import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { exportGuarantorsToCSV } from "../../../api/guanrantor.api";

export default function ExportGuarantor({ isOpen, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [testMode, setTestMode] = useState(false);

  const exportMutation = useMutation({
    mutationFn: () =>
      exportGuarantorsToCSV({
        startDate,
        endDate,
        testMode: testMode ? String(testMode) : undefined,
      }),
    onSuccess: (data) => {
      console.log({ data });
      handleExportCandidateCSV(data);
    },
    onError: (err) => {
      setError(err.message || "Something went wrong while exporting.");
    },
  });

  const handleExport = async () => {
    setError("");
    if (!startDate || !endDate) {
      setError("Please select a start and end date");
      return;
    }
    exportMutation.mutate();
  };

  //   Address Verification: Employee Name, Employee Code, Company Code, Company Name, Verification (Address), Employee’s Full Address, Date Verified, Remark.

  const handleExportCandidateCSV = async (guarantors) => {
    console.log({ guarantors });

    if (!guarantors?.length) {
      setError("No verified guarantors to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("guarantors");

    worksheet.columns = [
      { header: "S/N", key: "sn", width: 6 },
      { header: "Employee name", key: "employeeName", width: 35 },
      { header: "Employee Code", key: "employeeCode", width: 30 },
      { header: "Company Code", key: "companyCode", width: 20 },
      { header: "Company Name", key: "companyName", width: 20 },
      { header: "Guarantor Full Name", key: "guarantorFullName", width: 35 },
      { header: "Date Verified", key: "dateVerified", width: 18 },
      { header: "Remark", key: "remark", width: 25 },
    ];

    guarantors.forEach((guarantor, index) => {
      const employeeName = `${guarantor?.candidateId?.data?.firstname || ""} ${
        guarantor?.candidateId?.data?.middlename || ""
      } ${guarantor?.candidateId?.data?.surname || ""}`.trim();

      worksheet.addRow({
        sn: index + 1,
        employeeName: employeeName || "N/A",
        employeeCode: guarantor?.candidateId?.details?.EmployeeCode || "N/A",
        companyCode: guarantor?.candidateId?.details?.company_code || "N/A",
        companyName: guarantor?.candidateId?.details?.company_code || "N/A",
        guarantorFullName: guarantor?.name || "N/A",
        dateVerified: guarantor?.dateVerified
          ? new Date(guarantor.dateVerified).toISOString().split("T")[0]
          : "N/A",
        remark: guarantor?.remark || "N/A",
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8F4FD" },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "guarantors.xlsx");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 rounded-lg relative w-[90%] max-w-md text-[14px] font-[400]">
        <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
          {/* Modal Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Export to CSV</h2>
            <div
              onClick={onClose}
              className="cursor-pointer font-semibold text-lg"
            >
              x
            </div>
          </div>

          {/* Date Pickers */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="font-semibold block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>

            {/* ✅ Test Mode Checkbox */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="testMode"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="w-4 h-4"
              />
              <label
                htmlFor="testMode"
                className="font-semibold cursor-pointer"
              >
                Test Mode (ignore date filters)
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 border-red-300 border px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              text="Cancel"
              type="button"
              className="bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold px-4"
              onClick={onClose}
            />
            <Button
              text={exportMutation.isPending ? "Exporting..." : "Export"}
              type="button"
              className="bg-primary text-white py-2 rounded-lg font-semibold px-4"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
