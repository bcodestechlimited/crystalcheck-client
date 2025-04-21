import React, { useState } from "react";
import PropTypes from "prop-types";

export default function FilterModal({ isOpen, onClose, onApply }) {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  if (!isOpen) return null;

  const submissionStatusOptions = [
    { id: 1, value: undefined, label: "All" },
    { id: 2, value: "0", label: "0/2 Submitted" },
    { id: 3, value: "1", label: "1/2 Submitted" },
    { id: 4, value: "2", label: "2/2 Submitted" },
    { id: 5, value: "3", label: "3/2 Submitted" },
  ];

  const handleApply = () => {
    onApply({ submittedStatus: submissionStatus });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="filter-modal-title"
      className="bg-white p-5 rounded-lg max-w-md absolute shadow-lg top-12 right-0 z-50"
    >
      <h3 id="filter-modal-title" className="text-lg font-semibold mb-4">
        Filter by Submission Status
      </h3>
      <div className="flex flex-col gap-2">
        {submissionStatusOptions.map(({ value, label, id }) => (
          <label key={id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="submissionStatus"
              value={value}
              checked={submissionStatus === value}
              onChange={() => setSubmissionStatus(value)}
              className="cursor-pointer"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
