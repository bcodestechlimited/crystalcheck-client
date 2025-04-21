import React, { useState } from "react";
import Button from "../../components/Button";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";
import Modal from "../../components/Modal";
import { CgDanger } from "react-icons/cg";
import { IoCheckboxOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import {
  useGuarantorActions,
  useGuarantorStore,
} from "../../store/guarantorStore";

export default function GuarantorView({ guarantor, isOpen }) {
  const { candidate, isSubmitting } = useCandidateStore();
  const { verifyCandidateGuarantor, notMatchCandidateGuarantor } =
    useCandiateActions();

  const { isSubmitting: isResetting } = useGuarantorStore();
  const { resetAttempts } = useGuarantorActions();

  const isVerified = guarantor?.isVerified;
  const isNotAMatch = guarantor?.notMatch;
  const isSubmitted = guarantor?.isSubmitted;

  const btnBgcolor = isVerified
    ? "bg-green-500"
    : "bg-primary hover:bg-opacity-90";

  console.log(guarantor);

  const signatureLink = guarantor?.signature;
  const isSignatureAvailable = !!signatureLink;
  const isPdfAvailable = !!guarantor?.pdfDocument;
  const isPhotoAvailable = !!guarantor?.photo;

  const getStatusClassName = (guarantor) => {
    if (guarantor?.isVerified) return "bg-green-100 text-green-500";
    if (guarantor?.notMatch) return "bg-red-100 text-red-500";
    if (guarantor?.isSubmitted) return "bg-purple-100 text-purple-500";
    return "bg-orange-100 text-yellow-500";
  };

  const getStatusText = (guarantor) => {
    if (guarantor?.isVerified) return "Verified";
    if (guarantor?.notMatch) return "No match";
    if (guarantor?.isSubmitted) return "Submitted";
    return "Pending";
  };

  const [verifyModal, setVerifyModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notMatchModal, setNotMatchModal] = useState(false);
  const [showNoMatchSuccess, setShowNoMatchSuccess] = useState(false);

  const openVerifyModal = () => setVerifyModal(true);
  const closeVerifyModal = () => setVerifyModal(false);

  const openSuccessModal = () => setShowSuccess(true);
  const closeSuccessModal = () => {
    setShowSuccess(false);
    closeVerifyModal(true);
  };

  const openNotMatchModal = () => setNotMatchModal(true);
  const closeNotMatchModal = () => setNotMatchModal(false);

  const openNoMatchSuccessModal = () => setShowNoMatchSuccess(true);
  const closeNoMatchSuccessModal = () => {
    setShowNoMatchSuccess(false);
    setNotMatchModal(false);
  };

  const handleVerify = async () => {
    await verifyCandidateGuarantor(data, openSuccessModal);
  };

  const handleNoMatch = async () => {
    await notMatchCandidateGuarantor(data, openNoMatchSuccessModal);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="px-2 flex flex-col gap-2 py-4 divide-y">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/4 text-left">Name</p>
          <p className="w-1/4 text-center">Uploaded Document</p>
          <p className="w-1/4 text-center">Photo</p>
          <p className="w-1/4 text-right">Signature</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/4 text-left">{guarantor?.name || "N/A"}</p>
          <a
            href={isPdfAvailable ? guarantor?.pdfDocument : undefined}
            target={isPdfAvailable ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-1/4 text-center ${
              isPdfAvailable ? "underline text-blue-800" : "cursor-not-allowed"
            }`}
          >
            {isPdfAvailable ? "View Uploaded" : "No pdf Available"}
          </a>
          <a
            href={isPhotoAvailable ? guarantor?.photo : undefined}
            target={isPhotoAvailable ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-1/4 text-center ${
              isPhotoAvailable
                ? "underline text-blue-800"
                : "cursor-not-allowed"
            }`}
          >
            {isPhotoAvailable ? "View Photo" : "No Photo Available"}
          </a>
          <a
            href={isSignatureAvailable ? signatureLink : undefined}
            target={isSignatureAvailable ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`w-1/4 text-right ${
              isSignatureAvailable
                ? "text-blue-800 underline"
                : "text-gray-500 cursor-not-allowed"
            } text-right`}
          >
            {isSignatureAvailable ? "View Signature" : "No Signature"}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/3 text-left">State</p>
          <p className="w-1/3 text-center">City</p>
          <p className="w-1/3 text-right">Company</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/3 text-left">{guarantor?.stateCode}</p>
          <p className="w-1/3 text-center">{guarantor?.town}</p>
          <p className="w-1/3 text-right">{guarantor?.company || "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/3 text-left">Phone</p>
          <p className="w-1/3 text-center">Years</p>
          <p className="w-1/3 text-right">Email Address</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/3 text-left">{guarantor?.phone || "N/A"}</p>
          <p className="w-1/3 text-center">{guarantor?.noOfYears || "N/A"}</p>
          <p className="w-1/3 text-right overflow-clip">
            {guarantor?.email || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="flex justify-start">
          <p className="w-1/2 text-left">Residential Address</p>
          <p className="w-1/2 text-right">Relationship to Applicant</p>
        </div>
        <div className="flex justify-start font-semibold">
          <p className="w-1/2 text-left flex flex-col gap-1">
            <span>{guarantor?.address1 || "N/A"}.</span>
            <span>{guarantor?.address2 || "N/A"}</span>
          </p>
          <p className="w-1/2 text-right">{guarantor?.grade || "N/A"}</p>
        </div>
      </div>

      <div className=" flex items-center justify-between py-2">
        <p>
          Attempts Left: {guarantor?.attemptsLeft}{" "}
          <span className="font-semibold pl-2">
            {guarantor?.attemptsLeft < 1 ? "Signature Forged" : null}
          </span>
        </p>
        <Button
          className="bg-yellow-300 px-4 py-1 rounded font-semibold hover:bg-opacity-70 transition flex items-center"
          onClick={() => resetAttempts(guarantor._id)}
          text="Reset Attempts"
          loadingText={"Resetting..."}
          loading={isResetting}
        ></Button>
      </div>

      {isVerified || isNotAMatch || !isSubmitted ? (
        <span
          className={`px-3 py-1 rounded-full w-fit text-sm ${getStatusClassName(
            guarantor
          )}`}
        >
          {getStatusText(guarantor)}
        </span>
      ) : (
        <div>
          <div className=" flex items-center gap-4 py-4">
            <Button
              text={isVerified ? "Verified" : "Verify"}
              disabled={isVerified || isNotAMatch || isSubmitting}
              className={`text-white px-6 py-2 rounded-lg text-center flex items-center font-semibold ${btnBgcolor}`}
              onClick={openVerifyModal}
            />
            <Button
              text={isNotAMatch ? "Did Not Match" : "No Match"}
              disabled={isVerified || isNotAMatch || isSubmitting}
              className={`bg-btnRed hover:bg-opacity-90 text-white px-6 py-2 rounded-lg flex items-center font-semibold ${isNotAMatch}`}
              onClick={openNotMatchModal}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={verifyModal}
        onClose={closeVerifyModal}
        icon={<CgDanger size={54} className=" text-yellow-600" />}
        title="Verifying"
        paragraph={`You are about to verify ${guarantor?.name}. Do you wish to proceed with this?`}
        button1={
          <Button
            text="Yes, Verify"
            loading={isSubmitting}
            loadingText={"Verifying..."}
            className="bg-btnBlue hover:bg-opacity-80 shadow-lg text-white py-2 px-6 rounded-full text-lg flex justify-center items-center"
            onClick={handleVerify}
          />
        }
        button2={
          <Button
            text="No, Don't"
            className="bg-btnRed hover:bg-opacity-80 shadow-lg text-white py-2 px-6 rounded-full text-lg flex justify-center items-center"
            onClick={closeVerifyModal}
          />
        }
      />
      <Modal
        isOpen={showSuccess}
        onClose={closeSuccessModal}
        icon={<IoCheckboxOutline size={64} className=" text-btnBlue" />}
        title="Guarantor Verified"
        paragraph={`${guarantor?.name} has been verified. Job well-done.`}
        button1={
          <Button
            text="Proceed"
            className="bg-btnBlue hover:bg-opacity-80 text-white py-2 px-6 rounded-full text-lg"
            onClick={closeSuccessModal}
          />
        }
      />
      {/* ===================================== */}
      <Modal
        isOpen={notMatchModal}
        onClose={closeVerifyModal}
        icon={<CgDanger size={54} className=" text-yellow-600" />}
        title="No Match?"
        paragraph={`${guarantor?.name} Do not match with the provided information. Are you sure about this?`}
        button1={
          <Button
            text="No, Not Sure"
            className="bg-btnBlue hover:bg-opacity-80 shadow-lg text-white py-2 px-6 rounded-full text-lg flex justify-center items-center"
            onClick={closeNotMatchModal}
          />
        }
        button2={
          <Button
            text="Yes, No Match"
            loading={isSubmitting}
            loadingText={"Updating..."}
            className="bg-btnRed hover:bg-opacity-80 shadow-lg text-white py-2 px-6 rounded-full text-lg flex justify-center items-center"
            onClick={handleNoMatch}
          />
        }
      />
      <Modal
        isOpen={showNoMatchSuccess}
        onClose={closeNoMatchSuccessModal}
        icon={<MdOutlineCancel size={64} className=" text-btnRed" />}
        title="Guarantor Not Match"
        paragraph={`${guarantor?.name} has been updated to no match. Job well-done.`}
        button1={
          <Button
            text="Proceed"
            className="bg-btnBlue hover:bg-opacity-80 text-white py-2 px-6 rounded-full text-lg"
            onClick={closeNoMatchSuccessModal}
          />
        }
      />
    </div>
  );
}
