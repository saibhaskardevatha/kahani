import React from 'react';
import { Pause, Play } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  onStop: () => void;
  onResume: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  isRunning,
  isPaused,
  onStop,
  onResume,
}) => {
  if (!isRunning && !isPaused) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-blue-700">
          Auto-continue in {timeLeft}s
        </span>
      </div>
      
      <button
        onClick={isRunning ? onStop : onResume}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-all duration-200 ${
          isRunning
            ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50'
            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
        }`}
        aria-label={isRunning ? 'Stop auto-continue timer' : 'Resume auto-continue timer'}
      >
        {isRunning ? (
          <>
            <Pause className="w-3.5 h-3.5" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5" />
            Continue
          </>
        )}
      </button>
    </div>
  );
}; 