import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { useRequestStore } from "../store/useThemeStore ";

const useReceivedRequest = () => {
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["getReceivedFriendRequests"],
    queryFn: getFriendRequests,
  });
  return { friendRequests, isLoading };
};

export default useReceivedRequest;
