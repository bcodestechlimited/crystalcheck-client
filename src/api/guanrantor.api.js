import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";
import { handleError } from "../utils/handleError";

export const exportGuarantorsToCSV = async (params) => {
  try {
    const response = await axiosInstance.get(`/admin/guarantors/export`, {
      params,
    });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};
