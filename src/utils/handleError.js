import { toast } from "sonner";

export const handleError = (error) => {
  // console.error(error);
  const { response } = error;
  if (response?.data?.message) {
    if (response?.data?.message.startsWith("No")) {
      return toast.error("Please sign in", {
        id: "unique",
      });
    }
    return toast.error(response.data.message);
  }
  toast.error("Something went wrong");
};
