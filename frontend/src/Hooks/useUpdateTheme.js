import { useMutation } from "@tanstack/react-query";
import { updatetheme } from "../lib/api";
import toast from "react-hot-toast";

const useUpdateTheme = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: updatetheme,
    onError: () => toast.error("Error updating theme"),
  });
  return { themeMutation: mutate, isPending, error };
};

export default useUpdateTheme;
