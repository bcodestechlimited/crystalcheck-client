import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGuarantorActions,
  useGuarantorStore,
} from "../../store/guarantorStore";
import GuarantorHeader from "../CandidateDetail/GuarantorHeader";
import GuarantorView from "../CandidateDetail/GuarantorView";
import { IoIosArrowRoundBack } from "react-icons/io";
import Loader from "../../components/Loader";

export default function GuarantorDetail() {
  const { guarantorId } = useParams(); // Get the guarantorId from the URL params
  const { getGuarantor } = useGuarantorActions();
  const { guarantor, isLoading } = useGuarantorStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (guarantorId) {
      getGuarantor(guarantorId); // Fetch the guarantor data when the component mounts
    }
  }, [guarantorId, getGuarantor]);

  const toggleDetails = () => {
    setIsOpen((prev) => !prev);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="">
      <Link
        to="/partners/ics/guarantors"
        className="bg-white p-2 flex gap-2 items-center text-xl font-semibold group cursor-pointer mt-5"
      >
        <IoIosArrowRoundBack
          size={34}
          className="cursor-pointer group-hover:animate-shake"
        />
        Back
      </Link>
      <div className="py-6 border my-6 px-6 rounded bg-white">
        <div className="flex justify-between items-center px-2 pb-4">
          <p className="text-2xl font-semibold">Guarantor Details</p>
          <button
            onClick={toggleDetails}
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
    </div>
  );
}
