import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";
import { handleError } from "../utils/handleError";

export const getCertificates = async (params) => {
  try {
    const response = await axiosInstance.get(`/admin/certificates`, { params });
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};

export const getCertificate = async (certificateId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/certificates/${certificateId}`
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};

export const updateCertificate = async (certificateId, payload) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/certificates/${certificateId}`,
      payload
    );

    console.log({ data: response.data });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};

export const exportCertificatesToCSV = async (params) => {
  try {
    console.log({ params });

    const response = await axiosInstance.get(`/admin/certificates/export`, {
      params,
    });

    console.log({ data: response.data });

    return response.data?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};
