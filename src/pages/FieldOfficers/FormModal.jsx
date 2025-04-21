import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ModalWrapper from "../../components/ModalWrapper";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { CiSquarePlus } from "react-icons/ci";
import {
  useOfficerActions,
  useOfficerStore,
} from "../../store/useOfficerStore";
import CustomDropdown from "../../components/CustomDropdown";

export default function FormModal({ isOpen, onClose, refresh }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [officerName, setOfficerName] = useState("");

  const { isLoading } = useOfficerStore();
  const { addOfficer } = useOfficerActions();

  const methods = useForm();
  const { handleSubmit, reset } = methods;

  const openSuccessModal = () => {
    setShowSuccess(true);
    reset();
    refresh();
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    onClose();
  };

  const onSubmit = async (data) => {
    setOfficerName(data?.fullName);
    await addOfficer(data, openSuccessModal);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper heading="Add Officers" isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormInput
            name="fullName"
            label="Full Name"
            validation={{ required: "Full name is required" }}
            className="border border-gray-300 rounded p-2 text-sm outline-none"
          />

          <FormInput
            name="email"
            label="Email Address"
            type="email"
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            }}
            className="border border-gray-300 rounded p-2 text-sm outline-none"
          />

          <FormInput
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            validation={{
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Phone number must be 10-15 digits",
              },
            }}
            className="border border-gray-300 rounded p-2 text-sm outline-none"
          />

          <FormInput
            name="password"
            label="Password"
            validation={{ required: "Password is required" }}
            className="border border-gray-300 rounded p-2 text-sm outline-none"
          />

          <CustomDropdown
            name="gender"
            label="Gender"
            options={["Male", "Female"]}
            validation={{ required: "Gender is required" }}
          />

          <Button
            text="Add Officer"
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            loadingText={`Adding...`}
            className="w-full px-4 py-2 bg-primary text-white rounded font-medium text-base flex justify-center items-center"
          />
        </form>
      </FormProvider>
      <Modal
        isOpen={showSuccess}
        onClose={closeSuccessModal}
        icon={<CiSquarePlus size={34} />}
        title="Officer Added"
        paragraph={`You have successfully added ${officerName}`}
        button1={
          <Button
            text="Okay"
            className="bg-primary text-white py-2 px-6 rounded-lg text-lg font-semibold"
            onClick={closeSuccessModal}
          />
        }
      />
    </ModalWrapper>
  );
}
