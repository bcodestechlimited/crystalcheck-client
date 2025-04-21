import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

export function useSearchParamsStorage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const saveSearchParams = (params) => {};

  const reapplySearchParams = () => {};

  const clearStoredParams = () => {
    localStorage.removeItem("searchParamsKey");
  };

  useEffect(() => {
    reapplySearchParams();
  }, [location.pathname]);

  return {
    searchParams,
    saveSearchParams,
    reapplySearchParams,
    clearStoredParams,
  };
}
