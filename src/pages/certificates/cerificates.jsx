import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { getCertificates } from "../../api/certificate.api";
import DataTable from "../../components/data-table";

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

  return (
    <div>
      <DataTable
        columns={columns}
        data={data?.certificates || []}
        loading={isLoading}
      />
      <Pagination
        totalPages={data?.pagination.totalPages || 1}
        currentPage={data?.pagination.currentPage || 1}
        isLoading={isLoading}
      />
    </div>
  );
}
