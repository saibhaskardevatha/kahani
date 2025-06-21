"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const router = useRouter();

  const suggestions = [
    "A time traveler wakes up in 1920s Paris with no memory, only to discover they're being hunted by a mysterious organization that knows their future",
    "In a world where dreams are recorded and sold as entertainment, a woman discovers her recurring nightmare is actually a suppressed memory of a crime she witnessed",
    "A small-town radio DJ receives a call from someone claiming to be from 50 years in the future, warning about an event that will happen in exactly 24 hours",
  ];

  const tips = [
    "Keep your storyline concise but descriptive",
    "Include key characters and their motivations",
    "Mention the setting and atmosphere you want",
    "Specify the tone (dramatic, comedic, mysterious, etc.)",
    "Add any specific audio elements you'd like to hear",
  ];

  const languages = [
    {
      name: "Hindi",
      icon: "हिं",
      flag: "हिंदी",
    },
    {
      name: "Marathi",
      icon: "म",
      flag: "मराठी",
    },
    {
      name: "Telugu",
      icon: "తె",
      flag: "తెలుగు",
    },
    {
      name: "Punjabi",
      icon: "ਪ",
      flag: "ਪੰਜਾਬੀ",
    },
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const id = Math.random().toString(36).substring(7);
    router.push(
      `/chat/${id}?prompt=${encodeURIComponent(
        prompt
      )}&language=${encodeURIComponent(selectedLanguage)}`
    );
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const selectedLanguageData = languages.find(
    (lang) => lang.name === selectedLanguage
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Warpspeed FM
          </h1>
          <p className="text-muted-foreground">
            Share your story idea and we&apos;ll transform it into an immersive
            audio experience
          </p>
        </div>

        {/* Prompt Input Section */}
        <div className="w-full space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What is your story line?"
            className="w-full min-h-[160px] p-5 rounded-md border-2 border-slate-200 dark:border-slate-700/50 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-black-500/50 dark:focus:ring-black-400/50 font-[family-name:var(--font-geist-sans)] text-base"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          />
          <div className="flex items-center justify-between">
            {/* Tips Icon */}
            <button
              onClick={() => setShowTips(!showTips)}
              className="cursor-pointer p-2 h-10 w-10 flex items-center justify-center rounded-full transition-colors text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 dark:text-slate-400"
              title="Show writing tips"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              {/* Custom Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 rounded-md border-2 border-slate-200 dark:border-slate-700/50 bg-background text-foreground h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black-500/50 dark:focus:ring-black-400/50 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                  <span className="text-lg">{selectedLanguageData?.icon}</span>
                  <span>{selectedLanguageData?.name}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${
                      showLanguageDropdown ? "rotate-180" : ""
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 overflow-hidden">
                    {languages.map((language) => (
                      <button
                        key={language.name}
                        onClick={() => handleLanguageSelect(language.name)}
                        className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          selectedLanguage === language.name
                            ? "bg-slate-100 dark:bg-slate-700 text-black dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="text-lg">{language.icon}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {language.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {language.flag}
                          </span>
                        </div>
                        {selectedLanguage === language.name && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-auto text-green-500"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="rounded-md flex items-center justify-center bg-black text-white dark:bg-white dark:text-black gap-2 font-semibold text-sm h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg transition-shadow"
              >
                Create
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showTips ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h4 className="font-medium text-sm mb-3 text-foreground">
                Writing Tips
              </h4>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-xs mt-1 text-primary">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="w-full space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Try these story lines:
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-3 rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm font-[family-name:var(--font-geist-sans)] cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
