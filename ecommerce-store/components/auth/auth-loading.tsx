"use client";

import React from "react";

interface AuthLoadingProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  text?: string;
}

const AuthLoading: React.FC<AuthLoadingProps> = ({
  size = "medium",
  fullScreen = false,
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-t-accent rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default AuthLoading;

