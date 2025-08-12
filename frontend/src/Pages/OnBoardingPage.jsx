import React, { useEffect, useRef, useState } from "react";
import useAuthUser from "../Hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { onboardingFn } from "../lib/api";

import {
  CameraIcon,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { Country, State, City } from "country-state-city";

const OnBoardingPage = () => {
  //city suggestions feature
  const fileInputRef = useRef(null);
  const { authUser } = useAuthUser();
  const [suggestions, setSuggestions] = useState([]);
  // const [allCities, setAllCities] = useState([]);
  // const [showSuggestions, setShowSuggestions] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
  });
  const itemRefs = useRef([]); // store each suggestion's ref

  // Load all cities only once for performance
  const [query, setQuery] = useState(authUser?.location || "");
  // const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionBoxRef = useRef();

  useEffect(() => {
    if (query.length > 1) {
      const cities = City.getAllCities()
        .filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10); // limit results
      setSuggestions(cities);
    } else {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }, [query]);
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) selectCity(suggestions[activeIndex]);
    }
  };

  const selectCity = (city) => {
    const locationStr = `${city.name}, ${city.countryCode}`;
    setProfileData({ ...profileData, location: locationStr });
    setQuery(locationStr);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  // Scroll to active suggestion
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

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
      // setProfileData((prev) => ({
      //   ...prev,
      //   profilePic: URL.createObjectURL(selectedFile), // for preview
      // }));
    }
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
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
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
                className="btn btn-outline btn-sm mt-2"
              >
                Upload from PC
              </button>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
              />
              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
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
            {/* LOCATION */}
            {/* <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div> */}

            {/* ----------------- */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
                {suggestions.length > 0 && (
                  <ul
                    ref={suggestionBoxRef}
                    className="absolute z-50 bg-base-100 border border-base-300 rounded-md mt-1 max-h-48 overflow-y-auto w-full shadow-lg"
                  >
                    {suggestions.map((city, index) => (
                      <li
                        key={`${city.name}-${city.countryCode}`}
                        onClick={() => selectCity(city)}
                        ref={(el) => (itemRefs.current[index] = el)}
                        className={`px-3 py-2 cursor-pointer hover:bg-base-200 ${
                          index === activeIndex ? "bg-base-300" : ""
                        }`}
                      >
                        {city.name}, {city.countryCode}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
