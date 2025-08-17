import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getFriendRequests } from "../lib/api";

const useReceivedRequest = () => {
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["getReceivedFriendRequests"],
    queryFn: getFriendRequests,
  });
  return { friendRequests, isLoading };
};

export default useReceivedRequest;
