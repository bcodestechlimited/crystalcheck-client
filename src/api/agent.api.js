import { AxiosError } from "axios";
import axiosInstance from "../utils/axios.config";

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
