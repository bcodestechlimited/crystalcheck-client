import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";
import { toast } from "sonner";

const actions = (set) => ({
  getAllGuarantors: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/guarantors", {
        params: query,
      });
      const data = response?.data?.data;

      set((state) => ({
        guarantors: data?.guarantors,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  getGuarantor: async (guarantorId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/admin/guarantors/${guarantorId}`
      );
      const data = response?.data?.data;

      set((state) => ({
        guarantor: data?.guarantor,
        status: data?.status,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  assignGuarantors: async (agentId, guarantors, query = {}, closeModal) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/admin/guarantors/assign`, {
        agentId,
        guarantors,
      });
      toast.success(
        response?.data?.message || "Guarantor Assigned Successfully"
      );
      await actions(set).getAllGuarantors(query);
      closeModal();
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  resetAttempts: async (guarantorId) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.put(
        `/admin/guarantors/${guarantorId}`
      );
      toast.success(response?.data?.message || "Attempt Reset Successfully");
      await actions(set).getGuarantor(guarantorId);
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
});

export const useGuarantorStore = create((set) => {
  return {
    guarantors: [],
    guarantor: {},
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

export const useGuarantorActions = () =>
  useGuarantorStore((state) => state.actions);
