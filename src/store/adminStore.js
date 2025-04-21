import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";

const actions = (set) => ({
  getAllAdmins: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin", {
        params: query,
      });
      const data = response?.data?.data;

      set((state) => ({
        admins: data?.admins,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAdmin: async (formData, openSuccessModal) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/admin`, formData);
      const data = response?.data?.data;
      openSuccessModal();
      set({ isLoading: false });
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
});

export const useAdminStore = create((set) => {
  return {
    admins: [],
    admin: {},
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
      filteredCount: 0,
      perPage: 0,
    },
    isLoading: false,
    isSubmitting: false,
    actions: actions(set),
  };
});

export const useAdminActions = () => useAdminStore((state) => state.actions);
