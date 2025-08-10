import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authuser } from "../lib/api";

const useAuthUser = () => {
  //using tanstack
  const { data: authData, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: authuser, // authuser function from lib/api
    retry: false,
  });

  return { authUser: authData?.data?.user, isLoading };
};

export default useAuthUser;
