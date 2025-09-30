import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Button from "../../../components/Button";
import { exportCertificatesToCSV } from "../../../api/certificate.api";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export default function ExportToCSVModal({ isOpen, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [testMode, setTestMode] = useState(false);

  const exportMutation = useMutation({
    mutationFn: () =>
      exportCertificatesToCSV({
        startDate,
        endDate,
        testMode: testMode ? String(testMode) : undefined,
      }),
    onSuccess: (data) => {
      console.log({ data });
      handleExportCSV(data);
    },
    onError: (err) => {
      setError(err.message || "Something went wrong while exporting.");
    },
  });

  const handleExport = () => {
    setError("");

    if (!startDate || !endDate) {
      setError("Please select a start and end date")
      return;
    }
    exportMutation.mutate();
  };

  const handleExportCSV = async (certificates) => {
    if (!certificates?.length) {
      setError("No certificates to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Certificates");

    worksheet.columns = [
      { header: "S/N", key: "sn", width: 6 },
      { header: "Employee name", key: "employeeName", width: 35 },
      { header: "Employee Code", key: "employeeCode", width: 30 },
      { header: "School Name", key: "schoolName", width: 20 },
      { header: "Qualification", key: "qualification", width: 20 },
      { header: "Course", key: "course", width: 25 },
      {
        header: "Degree Classification",
        key: "degreeClassification",
        width: 25,
      },
      {
        header: "Method Of Verification",
        key: "methodOfVerification",
        width: 20,
      },
      { header: "Verification Status", key: "verificationStatus", width: 18 },
      { header: "Date Verified", key: "dateVerified", width: 18 },
      { header: "Remark", key: "remark", width: 25 },
    ];

    certificates.forEach((certificate, index) => {
      const employeeName = `${
        certificate?.candidateId?.details?.firstname || ""
      } ${certificate?.candidateId?.details?.middlename || ""} ${
        certificate?.candidateId?.details?.surname || ""
      }`.trim();

      worksheet.addRow({
        sn: index + 1,
        employeeName: employeeName || "N/A",
        employeeCode: certificate?.candidateId?.details?.EmployeeCode || "N/A",
        schoolName: certificate?.institutionName || "N/A",
        qualification: certificate?.qualificationCode || "N/A",
        course: certificate?.courseCode || "N/A",
        degreeClassification: certificate?.resultGrade || "N/A",
        methodOfVerification: certificate?.methodOfVerification || "N/A",
        verificationStatus: certificate?.verificationStatus || "N/A",
        dateVerified: certificate?.dateVerified
          ? new Date(certificate.dateVerified).toISOString().split("T")[0]
          : "N/A",
        remark: certificate?.remark || "N/A",
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
    saveAs(new Blob([buffer]), "certificates.xlsx");
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
