import React from "react";
import classes from "@/styles/LoadingSpinner.module.css";

const LoadingSpinner = ({ className }) => {
  const allClasses = `${classes.loader} ${className}`;
  return <div className={allClasses}></div>;
};

export default LoadingSpinner;
