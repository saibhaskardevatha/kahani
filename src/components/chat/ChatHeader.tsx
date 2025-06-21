import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatHeaderProps {
  title?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title = "Kahani" }) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between">
        <button
          onClick={handleGoHome}
          className="text-lg font-bold text-slate-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Go to home page"
        >
          {title}
        </button>
        <button
          onClick={handleGoHome}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex-shrink-0"
          aria-label="Create new story"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Create New Story
        </button>
      </div>
    </header>
  );
}; 