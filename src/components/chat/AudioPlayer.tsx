import React, { useState } from 'react';
import { AudioPlayerProps } from '../../types/chat';
import { AudioWaveform } from './AudioWaveform';

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Generated Episodes
      </h2>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="cursor-pointer w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex items-center justify-center"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex items-center justify-center"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Episode 1
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The Beginning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AudioWaveform isPlaying={isPlaying} />
          <button
            className="cursor-pointer p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            title="Download Audios"
            aria-label="Download audio files"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 