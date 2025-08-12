import { axiosInstance } from "./Axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const authuser = async () => {
  const rsp = await axiosInstance.get("/auth/me");
  return rsp;
};

// export const onboardingFn = async (onBoardingData) => {
//   const response = await axiosInstance.post("/auth/onboarding", onBoardingData);
//   return response;
// };
export const onboardingFn = async (onBoardingData) => {
  // const formData = new FormData();
  // for (let key in onBoardingData) {
  //   formData.append(key, onBoardingData[key]);
  // }

  const response = await axiosInstance.post(
    "/auth/onboarding",
    onBoardingData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};
