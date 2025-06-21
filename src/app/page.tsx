"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [showTips, setShowTips] = useState(false);

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

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleGenerate = () => {
    // Handle generate action here
    console.log("Generating response for:", prompt);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
            className="w-full min-h-[160px] p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700/50 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-black-500/50 dark:focus:ring-black-400/50 font-[family-name:var(--font-geist-sans)] text-base"
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
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="rounded-xl flex items-center justify-center bg-black text-white dark:bg-white dark:text-black gap-2 font-semibold text-sm h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg transition-shadow"
            >
              Create
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v6h6" />
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
                <path d="M21 22v-6h-6" />
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
              </svg>
            </button>
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
                className="text-left p-3 rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm font-[family-name:var(--font-geist-sans)] cursor-pointer"
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
