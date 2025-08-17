import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "../lib/api";

const useCancelRequest = () => {
  const queryClient = useQueryClient();
  const { mutate: cancelRequestMutation, isPending: pendingCancel } =
    useMutation({
      mutationFn: cancelFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["requestsSent"],
        });
        queryClient.invalidateQueries({
          queryKey: ["getReceivedFriendRequests"],
        });
      },
    });
  return { cancelRequestMutation, pendingCancel };
};

export default useCancelRequest;
