import React from "react";

export default function GuarantorHeader({ guarantor, isOpen }) {
  if (!isOpen) {
    return null;
  }
  const isVerified = guarantor?.isVerified
    ? `bg-green-100 text-green-500`
    : guarantor?.notMatch
    ? "bg-red-100 text-red-500"
    : guarantor?.isSubmitted
    ? `bg-purple-100 text-purple-500`
    : "bg-orange-100 text-yellow-500";

  const statusText = guarantor?.isVerified
    ? `Verified`
    : guarantor?.notMatch
    ? "No match"
    : guarantor?.isSubmitted
    ? "Submitted"
    : "Pending";

  const signatureLink = guarantor?.signature;
  const isSignatureAvailable = !!signatureLink;
  const isPdfAvailable = !!guarantor?.pdfDocument;

  return (
    <div className="px-2 flex flex-col gap-2 py-4">
      <div className="flex justify-between gap-4">
        <p className="w-1/4 text-left">Name</p>
        <p className="w-1/4 text-left">Signature</p>
        <p className="w-1/4 text-left">Uploaded Document</p>
        <p className="w-1/4 text-right">Status</p>
      </div>
      <div className="flex justify-between font-semibold gap-4">
        <p className="w-1/4 text-left">{guarantor?.name}</p>
        <a
          href={isSignatureAvailable ? signatureLink : undefined}
          target={isSignatureAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`w-1/4 ${
            isSignatureAvailable
              ? "text-blue-800 underline"
              : "text-gray-500 cursor-not-allowed"
          } text-left`}
        >
          {isSignatureAvailable ? "View Uploaded" : "No Signature"}
        </a>
        <a
          href={isPdfAvailable ? guarantor?.pdfDocument : undefined}
          target={isPdfAvailable ? "_blank" : undefined}
          rel="noopener noreferrer"
          className={`w-1/4 text-left ${
            isPdfAvailable ? "underline text-blue-800" : "cursor-not-allowed"
          }`}
        >
          {isPdfAvailable ? "View Uploaded" : "No pdf Available"}
        </a>
        <p className="w-1/4 text-right font-normal">
          <span className={`px-3 py-1 rounded-full text-sm ${isVerified}`}>
            {statusText}
          </span>
        </p>
      </div>
    </div>
  );
}
