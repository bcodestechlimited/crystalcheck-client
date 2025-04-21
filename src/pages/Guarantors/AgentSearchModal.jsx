import React, { useEffect, useState } from "react";
import SearchableDropdown from "../../components/SearchableDropdown";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import { useGuarantorStore } from "../../store/guarantorStore";
import { useCandidateStore } from "../../store/useCandidateStore";

export default function AgentSearchModal({ isOpen, onClose, handleAssign }) {
  const {
    register,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { isSubmitting } = useGuarantorStore();
  const { isSubmitting: isSubmitting1 } = useCandidateStore();

  const onSubmit = (data) => {
    console.log({ data });

    handleAssign(data.agentId);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <div className=" flex justify-between items-center">
          <h3 className="text-lg font-semibold mb-4">Select Agent</h3>
          <p className=" cursor-pointer" onClick={onClose}>
            x
          </p>
        </div>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <SearchableDropdown
            name={"agentId"}
            placeholder="Search for an agent"
            register={register}
            setValue={setValue}
            errors={errors}
            trigger={trigger}
            validation={{
              required: "Please select an agent",
            }}
          />
          <Button
            text="Assign"
            loading={isSubmitting || isSubmitting1}
            loadingText={"Assigning..."}
            className="bg-primary text-white px-4 py-2 flex justify-center w-full mt-4 rounded font-semibold"
          />
        </form>
      </div>
    </div>
  );
}
