import { axiosInstance } from "./Axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const authuser = async () => {
  try {
    const rsp = await axiosInstance.get("/auth/me");
    return rsp;
  } catch (error) {
    console.log("Error in authUser api calling");
    return null;
  }
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const updatetheme = async (updatedTheme) => {
  const response = await axiosInstance.put("/auth/theme", {
    theme: updatedTheme,
  });
  return response.data;
};

export const onboardingFn = async (onBoardingData) => {
  const response = await axiosInstance.post(
    "/auth/onboarding",
    onBoardingData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

export const getUserFriends = async () => {
  const rsp = await axiosInstance.get("/users/friends");
  return rsp;
};

export const getRecommendedUsers = async () => {
  const rsp = await axiosInstance.get("/users/");
  return rsp;
};

export const getSentRequests = async () => {
  const rsp = await axiosInstance.get("/users/friend-request_sent");
  return rsp;
};
export const sendFriendRequest = async (ID) => {
  const rsp = await axiosInstance.post(`/users/friend-request/${ID}`, {});
  return rsp;
};
export const cancelFriendRequest = async (ID) => {
  const rsp = await axiosInstance.delete(
    `/users/friend-request/${ID}/reject`,
    {}
  );
  return rsp;
};
