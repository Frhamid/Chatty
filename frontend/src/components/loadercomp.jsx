import { Mosaic } from "react-loading-indicators";
import React from "react";
import { useThemeStore } from "../store/useThemeStore ";

const LoaderComp = () => {
  const { theme } = useThemeStore();
  console.log("loader theme", theme);
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      data-theme={theme}
    >
      <Mosaic size="large" text="" textColor="" />
      {/* color="#1c733e" */}
    </div>
  );
};

export default LoaderComp;
