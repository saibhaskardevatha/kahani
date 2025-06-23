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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          p-3 rounded-full transition-all duration-200 flex items-center justify-center
          ${isRecording 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
        aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
      >
        <MicrophoneIcon 
          className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} 
        />
      </button>
      
      {isRecording && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      
      {isProcessing && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-spin">
          <div className="w-full h-full border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="absolute top-full left-0 mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}; 