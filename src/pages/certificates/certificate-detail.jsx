import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { getCertificate } from "../../api/certificate.api";
import VerifyCertificateModal from "./verify-certificate-modal";
import { formatPrettyDate } from "../../utils/formatter";

const DetailSection = ({ title, children }) => (
  <div className="border p-2 rounded">
    {title && <p className="font-semibold py-4">{title}</p>}
    <div className="flex flex-col divide-y">{children}</div>
  </div>
);

const DetailRow = ({
  label,
  value,
  isValueLink,
  endLabel,
  endValue,
  isEndValueLink,
}) => (
  <div key={label} className="py-2 flex justify-between">
    <div className="flex flex-col gap-2">
      <p>{label}</p>
      {isValueLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 underline"
        >
          View
        </a>
      ) : (
        <p className="font-semibold capitalize">{value || "N/A"}</p>
      )}
    </div>

    {endLabel && (
      <div key={endLabel} className="flex flex-col items-end gap-4">
        <p>{endLabel}</p>
        {isEndValueLink ? (
          <a
            href={endValue}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 underline"
          >
            View
          </a>
        ) : (
          <p className="font-semibold capitalize">{endValue || "N/A"}</p>
        )}
      </div>
    )}
  </div>
);

export default function CertificateDetail() {
  const { certificateId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-certificate", { certificateId }],
    queryFn: () => getCertificate(certificateId),
  });

  const certificate = data?.certificate;

  const status = {
    pending: {
      color: "text-gray-500 bg-gray-100 px-2 py-1 rounded-full",
      text: "Pending",
    },
    verified: {
      color: "text-green-500 bg-green-100 px-2 py-1 rounded-full",
      text: "Verified",
    },
    fake: {
      color: "text-red-500 bg-red-100 px-2 py-1 rounded-full",
      text: "Fake",
    },
    forged: {
      color: "text-red-500 bg-red-100 px-2 py-1 rounded-full",
      text: "Forged",
    },
  };

  console.log({ certificate });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white border rounded w-full p-2">
        <Link
          to="/partners/ics/certificates"
          className="bg-white p-2 flex gap-2 items-center text-xl font-semibold group cursor-pointer"
        >
          <IoIosArrowRoundBack
            size={34}
            className="cursor-pointer group-hover:animate-shake"
          />
          Back
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="border bg-white w-full px-2 rounded py-4">
          <div className="flex items-center justify-between pb-6">
            <p className=" text-2xl font-semibold">
              {certificate?.candidateId?.details?.surname}{" "}
              {certificate?.candidateId?.details?.middlename}{" "}
              {certificate?.candidateId?.details?.firstname}
            </p>

            <Button
              text="Verify"
              className="text-xl bg-primary text-white px-6 py-2 rounded font-semibold flex items-center"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <DetailSection title="Certificate Information">
              <DetailRow
                label="Qualification"
                value={certificate?.qualificationCode}
                endLabel="Course Code"
                endValue={certificate?.courseCode}
              />
              <DetailRow
                label="Result Grade"
                value={certificate?.resultGrade}
                endLabel="Department"
                endValue={certificate?.department}
              />
              <DetailRow
                label="Faculty"
                value={certificate?.faculty}
                endLabel="Matric Number"
                endValue={certificate?.matricNo}
              />
              <DetailRow
                label="Start Month"
                value={certificate?.startMonth}
                endLabel="Start Year"
                endValue={certificate?.startYear}
              />
              <DetailRow
                label="End Month"
                value={certificate?.endMonth}
                endLabel="End Year"
                endValue={certificate?.endYear}
              />
              <DetailRow
                label="Remark"
                value={certificate?.remark}
                endLabel="Date Verified"
                endValue={formatPrettyDate(certificate?.dateVerified)}
              />
              {/* <DetailRow
                label="Method Of Verification"
                value={certificate?.methodOfVerification}
                endLabel="Verification Status"
                endValue={certificate?.verificationStatus}
              /> */}

              <div className="py-2 flex justify-between">
                <div className="flex flex-col gap-2">
                  <p>Method Of Verification</p>
                  <p className="font-semibold capitalize">
                    {certificate?.methodOfVerification ?? "N/A"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <p>Verification Status</p>
                  <p
                    className={`font-semibold capitalize ${
                      status[certificate?.verificationStatus]?.color ??
                      "text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                    }`}
                  >
                    {certificate?.verificationStatus}
                  </p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Documents">
              {certificate?.candidateId?.credentials &&
              certificate?.candidateId?.credentials.length > 0 ? (
                certificate?.candidateId?.credentials.map(
                  (eachCredential, i) => {
                    console.log({ eachCredential });

                    return (
                      <DetailRow
                        key={i}
                        label={eachCredential.document_type}
                        value={eachCredential.credential}
                        isValueLink
                      />
                    );
                  }
                )
              ) : (
                <p>No documents found for this candidate</p>
              )}
            </DetailSection>
          </div>
        </div>
      </div>

      <VerifyCertificateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        certificate={certificate}
      />
    </div>
  );
}
