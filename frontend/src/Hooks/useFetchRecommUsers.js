import React from "react";
import { getRecommendedUsers } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useFetchRecommUsers = () => {
  const { data: recommendedUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ["recomendedUsers"],
    queryFn: getRecommendedUsers,
  });
  return { recommendedUsers, loadingUsers };
};

export default useFetchRecommUsers;
