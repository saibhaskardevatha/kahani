"use client";

import { useState, useEffect } from "react";
import { KA_VARIATIONS } from "../constants";

export const AnimatedTitle = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % KA_VARIATIONS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-3xl font-bold tracking-tight mb-2">
    <span className="inline-block min-w-[1.5rem] font-bold text-3xl text-center transition-all duration-1500 ease-in-out text-red-600 dark:text-red-400 pr-0.5">
        {KA_VARIATIONS[currentIndex]}
      </span>
      hani
    </h1>
  );
}; 