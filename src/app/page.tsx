"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { TipsSection } from "../components/TipsSection";
import { SuggestionsSection } from "../components/SuggestionsSection";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { QuestionIcon, SparklesIcon } from "../components/icons";
import { LANGUAGES, SUGGESTIONS, TIPS, DEFAULT_LANGUAGE, APP_CONFIG } from "../constants";
import { validatePrompt, generateChatId, buildChatUrl } from "../utils/validation";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion);
    setError(null);
  }, []);

  const handleLanguageSelect = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  const handleGenerate = useCallback(() => {
    const validation = validatePrompt(prompt);
    
    if (!validation.isValid) {
      setError(validation.error || "Invalid input");
      return;
    }

    setError(null);
    const id = generateChatId();
    const url = buildChatUrl(id, prompt, selectedLanguage);
    router.push(url);
  }, [prompt, selectedLanguage, router]);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <AnimatedTitle />
          <p className="text-muted-foreground">
            {APP_CONFIG.description}
          </p>
        </div>

        {/* Prompt Input Section */}
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={handleKeyPress}
              placeholder={APP_CONFIG.placeholder}
              className="w-full min-h-[160px] p-5 rounded-md border-2 border-slate-200 dark:border-slate-700/50 bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-black-500/50 dark:focus:ring-black-400/50 font-[family-name:var(--font-geist-sans)] text-base"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              aria-label="Story idea input"
              aria-describedby={error ? "error-message" : undefined}
            />
            {error && (
              <p id="error-message" className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Tips Icon */}
            <button
              onClick={() => setShowTips(!showTips)}
              className="cursor-pointer p-2 h-10 w-10 flex items-center justify-center rounded-full transition-colors text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 dark:text-slate-400"
              title="Show writing tips"
              aria-label="Toggle writing tips"
              aria-expanded={showTips}
            >
              <QuestionIcon />
            </button>

            <div className="flex items-center gap-3">
              <LanguageDropdown
                languages={LANGUAGES}
                selectedLanguage={selectedLanguage}
                onLanguageSelect={handleLanguageSelect}
              />
              
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="rounded-md flex items-center justify-center bg-black text-white dark:bg-white dark:text-black gap-2 font-semibold text-sm h-10 px-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                aria-label="Create audio story"
              >
                {APP_CONFIG.createButtonText}
                <SparklesIcon />
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <TipsSection tips={TIPS} isVisible={showTips} />
        </div>

        {/* Suggestions Section */}
        <SuggestionsSection
          suggestions={SUGGESTIONS}
          onSuggestionClick={handleSuggestionClick}
        />
      </main>
    </div>
  );
}
