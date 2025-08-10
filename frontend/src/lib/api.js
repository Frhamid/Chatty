import { axiosInstance } from "./Axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const authuser = async () => {
  const rsp = await axiosInstance.get("/auth/me");
  return rsp;
};
