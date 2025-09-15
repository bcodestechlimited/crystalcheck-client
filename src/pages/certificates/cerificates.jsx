import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { getCertificates } from "../../api/certificate.api";
import DataTable from "../../components/data-table";
import { BsPeopleFill } from "react-icons/bs";
import SearchInput from "../../components/SearchInput";

const columns = [
  {
    header: "First Name",
    render: (row) => row?.candidateId?.details?.firstname || "N/A",
  },
  {
    header: "Middle Name",
    render: (row) => row?.candidateId?.details?.middlename || "N/A",
  },
  {
    header: "Surname",
    render: (row) => row?.candidateId?.details?.surname || "N/A",
  },
  {
    header: "Date Verified",
    render: (row) => {
      if (!row.isVerified) {
        return "N/A";
      }
      return new Date(row?.dateVerified).toLocaleDateString();
    },
  },
  {
    header: "Verification Status",
    render: (row) => {
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

      const statusText = status[row?.verificationStatus] || status.pending;
      const statusColor = statusText.color;

      return <span className={statusColor}>{statusText.text}</span>;
    },
  },
  {
    header: "Actions",
    render: (row) => {
      return (
        <Link
          className="underline font-semibold text-primary"
          state={row._id}
          to={`/partners/ics/certificates/${row._id}`}
        >
          View
        </Link>
      );
    },
  },
];

export default function Certificates() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const perPage = searchParams.get("perPage") || 10;
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["get-certificates", { page, perPage, search }],
    queryFn: () => getCertificates({ page, perPage, search }),
  });

  console.log({ isLoading });

  console.log({ data });

  return (
    <div>
      <div className="flex gap-x-4">
        <div className="flex bg-[#F3FAFF] px-8 py-8 gap-x-4 flex-1 items-center rounded-lg">
          <BsPeopleFill className="text-primary" size={44} />
          <div>
            <p className="text-[16px] font-[500] text-secondary">
              Certificates
            </p>
            <p className="text-[20px] font-[700] text-secondary">
              {data?.pagination.totalCount?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 flex items-center justify-between">
        <p className="text-3xl text-secondary font-semibold">
          Certificates (
          {data?.pagination?.filteredCount?.toLocaleString() || "0"})
        </p>

        <div className="flex gap-2 relative">
          <SearchInput />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.certificates || []}
        isLoading={isLoading}
      />
      <Pagination
        totalPages={data?.pagination.totalPages || 1}
        currentPage={data?.pagination.currentPage}
        isLoading={isLoading}
      />
    </div>
  );
}
