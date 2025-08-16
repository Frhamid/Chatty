import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { signup } from "../lib/api";

const useSignup = () => {
  const [redirect, setRedirect] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, error, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setRedirect(true);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return { signupMutation: mutate, error, isPending, redirect };
};

export default useSignup;
