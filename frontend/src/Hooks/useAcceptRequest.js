import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest } from "../lib/api";

const useAcceptRequest = () => {
  const queryCLient = useQueryClient();

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryCLient.invalidateQueries({
        queryKey: ["getReceivedFriendRequests"],
      });
      queryCLient.invalidateQueries({
        queryKey: ["getFriends"],
      });
      queryCLient.invalidateQueries({
        queryKey: ["recomendedUsers"],
      });
    },
  });

  return { acceptRequestMutation, isPending };
};

export default useAcceptRequest;
