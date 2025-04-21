import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";
import GuarantorView from "./GuarantorView";
import GuarantorHeader from "./GuarantorHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import Button from "../../components/Button";

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
  </div>
);

export default function CandidateDetail() {
  const location = useLocation();
  const { state } = location;
  const { candidate, isLoading, guarantors } = useCandidateStore();
  const { getCandidate } = useCandiateActions();

  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    if (state?.staff_id) {
      getCandidate(state.staff_id);
    }
  }, [state, getCandidate]);

  const toggleDetails = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addressVerified = candidate?.addressSubmitted
    ? `bg-green-100 text-green-500`
    : `bg-yellow-100 text-yellow-500`;

  const addressStatus = candidate?.addressSubmitted
    ? `Verified`
    : "Not Verified";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-white border rounded w-full p-2">
        <Link
          to="/partners/ics/candidates"
          className="bg-white p-2 flex gap-2 items-center text-xl font-semibold group cursor-pointer"
        >
          <IoIosArrowRoundBack
            size={34}
            className="cursor-pointer group-hover:animate-shake"
          />
          Back
        </Link>

        <Button
          text="Sync"
          className="text-xl bg-primary text-white px-6 py-2 rounded font-semibold flex items-center"
          loading={isLoading}
          loadingText="Syncing..."
          onClick={() => getCandidate(state?.staff_id, true)}
        />
      </div>

      <div className="flex gap-4">
        <div className="border bg-white w-1/2 px-2 rounded py-4">
          <p className="pb-6 text-2xl font-semibold">
            {candidate?.surname} {candidate?.firstname}
          </p>
          <div className="flex flex-col gap-4">
            <DetailSection title="Personal Information">
              <DetailRow
                label="Passport"
                value="View Uploaded"
                endLabel="Gender"
                endValue={candidate?.sex}
              />
              <DetailRow
                label="Phone Number"
                value={candidate?.mobile_phone_number}
                endLabel="Email Address"
                endValue={candidate?.email_address}
              />
              <DetailRow
                label="Marital Status"
                value={candidate?.marital_status}
                endLabel="Date Of Birth"
                endValue={candidate?.date_of_birth}
              />
              <DetailRow
                label="No. Of Guarantor"
                value={candidate?.guarantor?.length}
                endLabel="State Of Residents"
                endValue={candidate?.["1st_guarantor_state_code"]}
              />
              <DetailRow
                label="State Of Resident"
                value="N/A"
                endLabel="Client"
                endValue={candidate?.company_code}
              />
            </DetailSection>

            <DetailSection title="Other Details">
              <DetailRow
                label="State Of Origin"
                value={candidate?.state_origin}
                endLabel="Local Government"
                endValue={candidate?.local_govt_of_origin_code}
              />
              <DetailRow
                label="Pension Fund Administration"
                value={candidate?.pfa_code || "N/A"}
                endLabel="Pension Pin"
                endValue={candidate?.pension_pin || "N/A"}
              />
              <DetailRow
                label="BVN"
                value={candidate?.bvn}
                endLabel="NIN"
                endValue={candidate?.nin}
              />
              <DetailRow
                label="Account Number"
                value={candidate?.bank_account_number}
                endLabel="Bank Name"
                endValue={candidate?.payment_code}
              />
            </DetailSection>

            <DetailSection>
              <DetailRow
                label="Address 1"
                value={candidate?.current_address_1}
                endLabel="City"
                endValue={candidate?.current_address_town}
              />
              <DetailRow
                label="Address 2"
                value={candidate?.current_address_2 || "N/A"}
                endLabel="City"
                endValue={candidate?.current_address_town}
              />
              <div className=" py-2">
                <div className="flex justify-between">
                  <p>Address Status</p>
                  <p
                    className={`rounded-full py-1 px-2 font-semibold ${addressVerified}`}
                  >
                    {addressStatus}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Address Remark</p>
                  <p className={`rounded-full font-semibold`}>
                    {candidate?.remark || "N/A"}
                  </p>
                </div>
                {candidate?.addressSubmitted ? (
                  <div className="flex flex-col gap-4 justify-between py-2">
                    <p>Address Photo</p>
                    <img src={candidate?.addressPhoto} alt="" />
                  </div>
                ) : (
                  <div className="flex justify-between py-2">
                    <p>Address Photo</p>
                    <p>N/A</p>
                  </div>
                )}
              </div>
            </DetailSection>
          </div>
        </div>

        <div className="flex flex-col gap-4 border bg-white w-1/2 p-2 py-6 rounded divide-y">
          {guarantors.map((guarantor, index) => {
            const isOpen = openSections[index]; // Determine the open state for this specific guarantor
            return (
              <div className="p-2" key={guarantor?._id}>
                <div className="flex justify-between items-center px-2 pb-4">
                  <p className="text-2xl font-semibold">
                    Guarantor {index + 1}
                  </p>
                  <button
                    onClick={() => toggleDetails(index)} // Toggle for this specific guarantor
                    className="underline text-blue-600 font-semibold"
                  >
                    {isOpen ? "View Less" : "View Details"}
                  </button>
                </div>
                <div className="flex flex-col">
                  <GuarantorHeader guarantor={guarantor} isOpen={!isOpen} />
                  <GuarantorView guarantor={guarantor} isOpen={isOpen} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
