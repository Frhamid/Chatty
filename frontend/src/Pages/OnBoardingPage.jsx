import React, { useState } from "react";
import useAuthUser from "../Hooks/useAuthUser";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
  });
  return <div>boarding page</div>;
};

export default OnBoardingPage;
