import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { getCertificate } from "../../api/certificate.api";
import VerifyCertificateModal from "./verify-certificate-modal";

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
  <div className="py-2 flex justify-between">
    <div className="flex flex-col gap-2">
      <p>{label}</p>
      <p
        className={`font-semibold ${
          isValueLink ? "text-blue-600 underline" : ""
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
    {endLabel && (
      <div className="flex flex-col items-end gap-4">
        <p>{endLabel}</p>
        <p
          className={`font-semibold ${
            isEndValueLink ? "text-blue-600 underline" : ""
          }`}
        >
          {endValue || "N/A"}
        </p>
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
                endValue={certificate?.dateVerified}
              />
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
