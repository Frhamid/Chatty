import React from "react";
import { getUserFriends } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useFetchUserFriends = () => {
  const { data: userFriends, isLoading: loadingFriends } = useQuery({
    queryKey: ["getFriends"],
    queryFn: getUserFriends,
  });
  return { userFriends, loadingFriends };
};

export default useFetchUserFriends;
