import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MicrophoneIcon } from './icons';

interface VoiceToTextProps {
  onTextReceived: (text: string) => void;
  disabled?: boolean;
}

export const VoiceToText: React.FC<VoiceToTextProps> = ({ 
  onTextReceived, 
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (isRecording) {
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      setRecordingDuration(0);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setIsRecording(true);
      setIsProcessing(false);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const mimeTypes = [
        'audio/wav',
        'audio/mpeg',
        'audio/mp3', 
        'audio/webm',
        'audio/ogg',
        'audio/opus',
        'audio/flac',
        'audio/aac',
        'audio/mp4',
        'audio/x-m4a',
        'video/webm'
      ];
      
      let selectedMimeType = null;
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('Selected supported MIME type:', mimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        console.log('No specific format supported, using browser default');
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.onstart = () => {
          console.log('Browser default MIME type:', mediaRecorderRef.current?.mimeType);
        };
      } else {
        console.log('Using MIME type:', selectedMimeType);
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: selectedMimeType
        });
      }
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        
        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error('No audio data recorded');
          }

          const totalSize = audioChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
          if (totalSize < 1024) {
            throw new Error('Audio recording too short. Please speak for at least 1 second.');
          }

          const rawMimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const mimeType = rawMimeType.split(';')[0];
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          const getFileExtension = (mimeType: string) => {
            const extensions: { [key: string]: string } = {
              'audio/wav': 'wav',
              'audio/mpeg': 'mp3',
              'audio/mp3': 'mp3',
              'audio/webm': 'webm',
              'audio/ogg': 'ogg',
              'audio/opus': 'opus',
              'audio/flac': 'flac',
              'audio/aac': 'aac',
              'audio/mp4': 'm4a',
              'audio/x-m4a': 'm4a',
              'video/webm': 'webm'
            };
            return extensions[mimeType] || 'webm';
          };
          
          const fileExtension = getFileExtension(mimeType);
          const fileName = `recording.${fileExtension}`;
          
          console.log('Audio blob created:', {
            size: audioBlob.size,
            originalType: rawMimeType,
            cleanType: mimeType,
            fileName: fileName,
            chunks: audioChunksRef.current.length
          });

          const formData = new FormData();
          formData.append('audio', audioBlob, fileName);

          console.log('Sending audio to API...');

          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });

          console.log('API response status:', response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          const data = await response.json();
          console.log('Sarvam API response:', data);
          
          if (data.text) {
            onTextReceived(data.text);
          } else {
            setError('No speech detected. Please try again.');
          }
        } catch (err) {
          console.error('Speech-to-text error:', err);
          setError(`Failed to process audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
        }
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording. Please check microphone permissions.');
      setIsRecording(false);
    }
  }, [onTextReceived]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
  }, []);

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [disabled, isRecording, startRecording, stopRecording]);

  return (
    <div className="relative group">
      {/* Main Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative p-4 rounded-full transition-all duration-500 ease-out
          ${isRecording 
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl scale-110' 
            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 hover:from-slate-200 hover:to-slate-300 hover:text-slate-700 hover:scale-105 shadow-lg hover:shadow-xl'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed scale-100' : 'cursor-pointer'}
          ${isProcessing ? 'animate-pulse' : ''}
        `}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
        aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
      >
        {/* Recording Ripple Effect */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full bg-red-300 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        
        {/* Icon */}
        <div className="relative z-10">
          <MicrophoneIcon 
            className={`w-3 h-3 transition-transform duration-300 ${
              isRecording ? 'animate-bounce' : 'group-hover:scale-110'
            }`} 
          />
        </div>
      </button>

      {/* Recording Status Indicator */}
      {isRecording && (
        <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-lg border border-red-200">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-slate-700">
            {formatDuration(recordingDuration)}
          </span>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="absolute -top-2 -right-2 flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-lg border border-blue-200">
          <div className="w-3 h-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs font-medium text-slate-700">Processing...</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg shadow-lg whitespace-nowrap z-20 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {error}
          </div>
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-50 border-l border-t border-red-200 rotate-45" />
        </div>
      )}

      {/* Tooltip */}
      {!isRecording && !isProcessing && !error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          Click to record voice
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
        </div>
      )}
    </div>
  );
}; 