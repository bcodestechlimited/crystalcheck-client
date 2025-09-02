import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";

export const getCandidates = async (query) => {
  try {
    const response = await axiosInstance.get(`/admin/candidates`, {
      params: query,
    });

    return {
      candidates: response.data.data.candidates,
      pagination: response.data.data.pagination,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};

export const getCandidate = async (staffId, update = "false") => {
  try {
    const response = await axiosInstance.get(
      `/candidates/details?staffId=${staffId}&update=${update}`
    );
    const data = response?.data?.data;
    return {
      candidate: data?.candidate,
      guarantors: data?.guarantors,
      status: data?.status,
      verificationInfo: data?.verification_info,
      credentails: data?.credentails,
      documents: data?.documents,
      certificates: data?.certificates,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};
