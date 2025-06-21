import React from 'react';
import { AudioWaveformProps } from '../../types/chat';
import { AUDIO_WAVEFORM_CONFIG } from '../../constants/workflow';

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying }) => {
  if (!isPlaying) {
    return (
      <div className="flex items-center justify-center w-24 h-6">
        <svg width="100" height="24" viewBox="0 0 100 24">
          <line 
            x1="0" 
            y1="12" 
            x2="100" 
            y2="12" 
            strokeWidth="2" 
            className="stroke-slate-300 dark:stroke-slate-600" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-24 h-6">
      <svg width="100" height="24" viewBox="0 0 100 24">
        {AUDIO_WAVEFORM_CONFIG.waves.map((wave, index) => (
          <path
            key={index}
            fill="none"
            stroke={wave.color}
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              dur={wave.dur}
              repeatCount="indefinite"
              values={wave.values}
            />
          </path>
        ))}
      </svg>
    </div>
  );
}; 