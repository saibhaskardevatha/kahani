"use client";

import { KA_VARIATIONS } from "../constants";

interface StaticTitleProps {
  language?: string;
}

export const StaticTitle = ({ language = "Hindi" }: StaticTitleProps) => {
  const getKaForLanguage = (lang: string) => {
    switch (lang) {
      case "Hindi":
        return KA_VARIATIONS[1]; // क
      case "Telugu":
        return KA_VARIATIONS[2]; // క
      case "Punjabi":
        return KA_VARIATIONS[3]; // ਕ
      case "Marathi":
        return KA_VARIATIONS[1]; // क (same as Hindi)
      default:
        return KA_VARIATIONS[0]; // Ka (English)
    }
  };

  const kaCharacter = getKaForLanguage(language);

  return (
    <h1 className="text-3xl font-bold tracking-tight mb-2">
      <span className="inline-block min-w-[1.5rem] font-bold text-3xl text-center text-red-600 pr-0.5">
        {kaCharacter}
      </span>
      hani
    </h1>
  );
}; 