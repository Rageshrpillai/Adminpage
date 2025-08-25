import React from "react";

const LoadingSpinner = ({
  size = "large",
  color = "blue",
  fullScreen = false,
  message = "Loading...",
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
    xlarge: "h-16 w-16",
  };

  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
    white: "border-white",
  };

  const containerClasses = fullScreen
    ? "min-h-screen flex flex-col items-center justify-center bg-gray-50"
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
      {message && (
        <p className="mt-3 text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
