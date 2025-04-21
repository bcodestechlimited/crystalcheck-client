import { create } from "zustand";
import { handleError } from "../utils/handleError";
import axiosInstance from "../utils/axios.config";
import { toast } from "sonner";

const actions = (set) => ({
  getAllCandidates: async (query) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/admin/candidates", {
        params: query,
      });
      const data = response?.data?.data;

      set((state) => ({
        candidates: data?.candidates,
        pagination: data?.pagination,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  getCandidate: async (staffId, update = false) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/candidates/details?staffId=${staffId}&update=${update}`
      );
      const data = response?.data?.data;

      set((state) => ({
        candidate: data?.candidate,
        guarantors: data?.guarantors,
        status: data?.status,
        verificationInfo: data?.verification_info,
        credentails: data?.credentails,
        documents: data?.documents,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyCandidateGuarantor: async (data, openSuccessModal) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(
        `/admin/guarantor/verify`,
        data
      );
      // await actions(set).getCandidate(staffId);
      openSuccessModal();
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  notMatchCandidateGuarantor: async (data, openSuccessModal) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(
        `/admin/guarantor/not-match`,
        data
      );
      // await actions(set).getCandidate(staffId);
      openSuccessModal();
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  assignCandidates: async (agentId, candidates, query = {}, closeModal) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/admin/candidates/assign`, {
        agentId,
        candidates,
      });
      toast.success(
        response?.data?.message || "Candidates Assigned Successfully"
      );
      await actions(set).getAllCandidates(query);
      closeModal();
    } catch (error) {
      handleError(error);
    } finally {
      set({ isSubmitting: false });
    }
  },
  setSearchParams: (params) => set({ searchParams: params }),
});

export const useCandidateStore = create((set) => {
  return {
    candidates: [],
    candidate: {},
    credentails: [],
    documents: [],
    guarantors: [],
    pagination: {
      currentPage: 0,
      totalPages: 0,
      totalCount: 0,
      filteredCount: 0,
      perPage: 0,
    },
    status: {},
    verificationInfo: {},
    isLoading: false,
    isSubmitting: false,
    searchParams: {},
    actions: actions(set),
  };
});

export const useCandiateActions = () =>
  useCandidateStore((state) => state.actions);
