import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";
import { handleError } from "../utils/handleError";

export const ToggleAgentActiveStatus = async ({ agentId, payload }) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/agents/${agentId}`,
      payload
    );

    console.log({ data: response.data.data });

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
    throw error;
  }
};

export const getAllAgents = async (query) => {
  console.log({ query });

  try {
    const response = await axiosInstance.get("/admin/agents", {
      params: query,
    });
    const data = response?.data?.data;

    return {
      officers: data?.agents,
      pagination: data?.pagination,
    };
  } catch (error) {
    handleError(error);
  }
};
