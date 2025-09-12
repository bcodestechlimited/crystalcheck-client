import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaCheckCircle, FaChevronDown } from "react-icons/fa";
import CustomAlert from "../../components/custom-alert";
import { updateCertificate } from "../../api/certificate.api";
import Button from "../../components/Button";

const methodsOfVerification = ["convocation-booklet", "cci-database"];
const verificationStatus = ["verified", "forged", "fake"];

export default function VerifyCertificateModal({
  isOpen,
  onClose,
  certificate,
}) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [error, setError] = useState("");

  const query = useQueryClient();

  const verificationMutation = useMutation({
    mutationFn: () =>
      updateCertificate(certificate._id, {
        methodOfVerification: selectedOption,
        verificationStatus: selectedStatus,
      }),
    onSuccess: (data) => {
      console.log({ data });
      console.log("success");
      setSelectedOption("");
      setSelectedStatus("");
      query.invalidateQueries({ queryKey: ["get-certificate"] });
      onClose();
    },
    onError: (error) => {
      console.log("error");
      setError(error.message);
    },
  });

  const handleOptionClick = (option) => {
    const lowerCaseOption = option.toLowerCase();
    setSelectedOption(lowerCaseOption);
    setIsOptionsOpen(false);
    setError("");
  };

  const handleStatusClick = (option) => {
    const lowerCaseOption = option.toLowerCase();
    setSelectedStatus(lowerCaseOption);
    setIsStatusOpen(false);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOption || !selectedStatus) {
      setError("Please select an option");
      return;
    }

    console.log({ selectedOption, selectedStatus });
    verificationMutation.mutateAsync();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-lg relative w-[90%] max-w-xl text-[14px] font-[400]">
        <div className="bg-white p-6 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Verify Certificate</h2>
            <div
              onClick={onClose}
              className="cursor-pointer font-semibold text-lg"
            >
              x
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <label htmlFor="" className="font-semibold ">
                Method Of Verification
              </label>
              <div className="flex justify-end">
                <div className="relative">
                  <div
                    className={`relative min-w-[200px] max-w-[250px] px-3 py-1 border border-gray-300 rounded-lg font-semibold flex items-center justify-between cursor-pointer`}
                    onClick={() => setIsOptionsOpen((prev) => !prev)}
                  >
                    <span
                      className={`capitalize min-h-6 ${
                        !selectedOption ? "text-gray-400" : ""
                      }`}
                    >
                      {selectedOption.replace("-", " ") || "Select an option"}
                    </span>
                    <FaChevronDown className="text-gray-500" />
                  </div>
                  {isOptionsOpen && (
                    <ul className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-y-auto ">
                      {methodsOfVerification.map((option, index) => (
                        <li
                          key={index}
                          className=" flex items-center justify-between px-4 py-2 font-semibold text-secondary hover:bg-gray-100 cursor-pointer capitalize"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option.replace("-", " ")}
                          {selectedOption === option && (
                            <FaCheckCircle className="text-primary" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="" className="font-semibold ">
                Verification Status
              </label>
              <div className="flex justify-end">
                <div className="relative">
                  <div
                    className={`relative min-w-[200px] max-w-[250px] px-3 py-1 border border-gray-300 rounded-lg font-semibold flex items-center justify-between cursor-pointer`}
                    onClick={() => setIsStatusOpen((prev) => !prev)}
                  >
                    <span
                      className={`capitalize min-h-6 ${
                        !selectedStatus ? "text-gray-400" : ""
                      }`}
                    >
                      {selectedStatus.replace("-", " ") || "Select an option"}
                    </span>
                    <FaChevronDown className="text-gray-500" />
                  </div>
                  {isStatusOpen && (
                    <ul className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-y-auto ">
                      {verificationStatus.map((option, index) => (
                        <li
                          key={index}
                          className=" flex items-center justify-between px-4 py-2 font-semibold text-secondary hover:bg-gray-100 cursor-pointer capitalize"
                          onClick={() => handleStatusClick(option)}
                        >
                          {option.replace("-", " ")}
                          {selectedStatus === option && (
                            <FaCheckCircle className="text-primary" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {error && <CustomAlert message={error} />}

            <Button
              text="Submit"
              type="submit"
              loading={verificationMutation.isPending}
              // loading={true}
              disabled={verificationMutation.isPending}
              className="bg-primary text-white py-2 rounded-lg font-semibold flex items-center justify-center"
              loadingText={"Verifying..."}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
