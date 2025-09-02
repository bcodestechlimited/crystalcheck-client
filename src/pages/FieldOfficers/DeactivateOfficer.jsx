import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import { ToggleAgentActiveStatus } from "../../api/agent.api";
import { toast } from "sonner";

export default function DeactivateOfficer({ officer }) {
  console.log({ officer });

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ToggleAgentActiveStatus,
    onSuccess: (data) => {
      console.log({ data });
      toast.success("Field Officer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["agentProfile"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error("Failed to update employee:", error);
    },
  });

  const handleToggle = async () => {
    await mutateAsync({
      agentId: officer._id,
      payload: { isActive: !officer.isActive },
    });
  };

  return (
    <div>
      <Button
        text={officer.isActive ? "Deactivate Officer" : "Activate Officer"}
        loadingText={
          officer.isActive ? "Deactivating Officer..." : "Activating Officer..."
        }
        className={`px-4 py-2 rounded-lg text-white font-semibold ${
          officer.isActive ? "bg-red-500" : "bg-green-500"
        }`}
        onClick={handleToggle}
        loading={isPending}
      />
    </div>
  );
}
