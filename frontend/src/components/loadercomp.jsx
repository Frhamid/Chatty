import { Mosaic } from "react-loading-indicators";
import React from "react";

const LoaderComp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Mosaic color="#1c733e" size="large" text="" textColor="" />
    </div>
  );
};

export default LoaderComp;
