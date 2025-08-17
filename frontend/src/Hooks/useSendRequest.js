import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequest } from "../lib/api";

const useSendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestsSent"] });
    },
  });
  return { sendRequestMutation, isPending };
};

export default useSendRequest;
