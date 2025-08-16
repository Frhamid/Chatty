import { useRef, useState } from "react";
import useAuthUser from "../Hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { onboardingFn } from "../lib/api";

import {
  CameraIcon,
  LoaderIcon,
  ShipWheelIcon,
  ShuffleIcon,
  Upload,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import LocationSearch from "../components/locationSearch";

const OnBoardingPage = () => {
  //city suggestions feature
  const fileInputRef = useRef(null);
  const { authUser } = useAuthUser();
  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
  });
  const queryClient = useQueryClient();
  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: onboardingFn,
    onSuccess: () => {
      toast.success("Onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (e) => {
      console.log("Error=", e);
      toast.error(e?.response?.data?.errors?.[0]?.msg);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // onboardingMutation(profileData);
    const formData = new FormData();
    formData.append("fullName", profileData.fullName);
    formData.append("bio", profileData.bio);
    formData.append("nativeLanguage", profileData.nativeLanguage);
    formData.append("learningLanguage", profileData.learningLanguage);
    formData.append("location", profileData.location);
    if (file) {
      formData.append("profilePic", file);
    } else {
      formData.append("profilePic", profileData?.profilePic);
    }

    await onboardingMutation(formData); // Sends FormData to backend
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setProfileData({ ...profileData, profilePic: randomAvatar });
    toast.success("Random avatar genrated!");
    // reset file input so same file can be picked again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  ///image upload part
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfileData({
        ...profileData,
        profilePic: URL.createObjectURL(selectedFile),
      });
    }
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-40">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4 relative">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {profileData.profilePic ? (
                  <img
                    src={profileData.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
              />

              {/* Upload Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput").click()}
                  className="btn  btn-accent"
                >
                  <Upload className="size-4 mr-2" />
                  Choose from Device
                </button>

                {/* Generate Random Avatar BTN */}
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>
            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>
            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={profileData.nativeLanguage}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={profileData.learningLanguage}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Location */}
            <LocationSearch
              location={profileData.location}
              onLocationChange={(newLocation) =>
                setProfileData({ ...profileData, location: newLocation })
              }
            />
            {/* SUBMIT BUTTON */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
