import { getSentRequests } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useFetchSentRequests = () => {
  const { data: sentRequests } = useQuery({
    queryKey: ["requestsSent"],
    queryFn: getSentRequests,
  });
  return { sentRequests };
};

export default useFetchSentRequests;
