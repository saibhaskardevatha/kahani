/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";

// Define Props for the component
export interface AudioPlayerProps {
  title: string;
  description: string;
  audioUrl: string;
  thumbnailUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title = "Your Audio Story",
  description = "Listen to the generated episode",
  audioUrl = "",
  thumbnailUrl = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", updateCurrentTime);

    // Set duration on mount in case it's already loaded
    if (audio.readyState > 0) {
      setAudioData();
    }

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = parseFloat(e.target.value);
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleDownload = async () => {
    if (!audioUrl) return;
    
    setIsDownloading(true);
    
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      
      // Create a safe filename with proper extension
      const safeTitle = title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
      const urlParts = audioUrl.split('.');
      const fileExtension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'wav';
      a.download = `${safeTitle}.${fileExtension}`;
      
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(audioUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const duration = Math.round(timeInSeconds);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const progressTrackColor = !audioUrl ? "bg-slate-300" : "bg-slate-200";

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Your Audio Story
      </h2>

      <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm flex overflow-hidden">
        {/* Left: Thumbnail */}
        <div className="w-64 md:w-64 h-auto bg-slate-100 flex-shrink-0">
          <img
            src={thumbnailUrl}
            alt="Episode thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-slate-200">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="text-slate-400">
                      <path d="M21.25,6.5H2.75A1.75,1.75,0,0,0,1,8.25v7.5A1.75,1.75,0,0,0,2.75,17.5h18.5A1.75,1.75,0,0,0,23,15.75V8.25A1.75,1.75,0,0,0,21.25,6.5ZM2.75,8h18.5a.25.25,0,0,1,.25.25v4.9L17,8.22a.75.75,0,0,0-1-.06l-4.22,3.48-3-2.24a.75.75,0,0,0-.9,0L2.5,14.63V8.25A.25.25,0,0,1,2.75,8Z" fill="currentColor"/>
                      <circle cx="8.5" cy="11" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>`;
              }
            }}
          />
        </div>

        {/* Right: Controls */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800 truncate">
                  {title}
                </h3>
                <p 
                  className="text-sm text-slate-500 max-w-[500px]"
                  title={description}
                >
                  {description}
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={!audioUrl || isDownloading}
                className="cursor-pointer p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title={isDownloading ? "Downloading..." : "Download"}
                aria-label={isDownloading ? "Downloading audio" : "Download audio"}
              >
                {isDownloading ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                ) : (
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 mt-8 justify-center">
            <button
              onClick={handlePlayPause}
              disabled={!audioUrl}
              className="transform -translate-y-2 cursor-pointer w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              )}
            </button>
            <div className="flex-grow">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                disabled={!audioUrl}
                className={`w-full h-1.5 ${progressTrackColor} rounded-lg appearance-none cursor-pointer audio-progress`}
                style={{ backgroundSize: `${progressPercentage}% 100%` }}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {formatTime(duration)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onEnded={handleAudioEnd}
      />
    </div>
  );
};
