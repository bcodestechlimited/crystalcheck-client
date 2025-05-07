import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";

export const fetchUserLogs = async (params) => {
  const { agentId } = params;
  try {
    const response = await axiosInstance.get(`/logs/user/${agentId}`, {
      params,
    });

    console.log(response.data, "user logs");

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed retrieving logs"
      );
    }
    throw error;
  }
};

export const fetchUserLogsCount = async (params) => {
  const { agentId } = params;

  try {
    const response = await axiosInstance.get(`/logs/user/${agentId}/count`, {
      params,
    });

    console.log(response.data.data, "user logs");

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed retrieving logs count"
      );
    }
    throw error;
  }
};
export const fetchAgentProfile = async (payload) => {
  const { agentId } = payload;
  try {
    const response = await axiosInstance.get(`/admin/agents/${agentId}`);

    console.log({ agent: response.data.data });

    return response.data.data.agent;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed retrieving agent profile"
      );
    }
    throw error;
  }
};
