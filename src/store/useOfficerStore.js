import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";

const actions = (set) => ({
  getAllOfficers: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/agents", {
        params: query,
      });
      const data = response?.data?.data;

      set((state) => ({
        officers: data?.agents,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  addOfficer: async (formData, openSuccessModal) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/admin/agents`, formData);
      const data = response?.data?.data;
      openSuccessModal();
      set({ isLoading: false });
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // setSearchParams: (params) => set({ searchParams: params }),
});

export const useOfficerStore = create((set) => {
  return {
    officers: [],
    officer: {},
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
      filteredCount: 0,
      perPage: 0,
    },
    isLoading: false,
    isSubmitting: false,
    // searchParams: {},
    actions: actions(set),
  };
});

export const useOfficerActions = () =>
  useOfficerStore((state) => state.actions);
