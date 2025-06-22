import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowStep, WorkflowStepData } from '../types/chat';
import { WORKFLOW_STEPS_DATA, WORKFLOW_CONFIG, WORKFLOW_STATUS } from '../constants/workflow';
import { getStoryOutline, getPersona, getScript, getAudio, getMetadata, getThumbnail, StoryOutlineResponse, PersonaResponse, ScriptResponse } from '../lib/api';

// ============================================================================
// TYPES
// ============================================================================

interface UseWorkflowReturn {
  steps: WorkflowStep[];
  currentStepIndex: number;
  isPlanning: boolean;
  isWorkflowComplete: boolean;
  autoContinueTimer: AutoContinueTimer;
  handleToggleExpand: (indexToToggle: number) => void;
  handleRetry: (indexToRetry: number) => void;
  handleContinue: (indexToContinueFrom: number) => void;
  handleImprove: (indexToImprove: number, feedback: string) => void;
  handleImproveClick: (indexToImprove: number) => void;
  handleStopTimer: () => void;
  handleResumeTimer: () => void;
  audioUrl: string | null;
  metadata: { title: string; description: string } | null;
  thumbnail: string | null;
}

interface AutoContinueTimer {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  activeStepIndex: number | null;
}

interface WorkflowConfig {
  language?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const initializeSteps = (): WorkflowStep[] => {
  return WORKFLOW_STEPS_DATA.map((step: WorkflowStepData, idx: number) => ({
    ...step,
    status: WORKFLOW_STATUS.PENDING,
    streamedContent: idx === 0 ? '' : step.content,
    isExpanded: false,
    isVisible: false,
  }));
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useAutoContinueTimer = () => {
  const [timer, setTimer] = useState<AutoContinueTimer>({
    isRunning: false,
    isPaused: false,
    timeLeft: 5,
    activeStepIndex: null,
  });

  const autoContinueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeLeftRef = useRef(5);
  const userInteractedRef = useRef(false);

  const startTimer = useCallback((stepIndex: number, onComplete: () => void) => {
    userInteractedRef.current = false;
    setTimer({
      isRunning: true,
      isPaused: false,
      timeLeft: 5,
      activeStepIndex: stepIndex,
    });
    pausedTimeLeftRef.current = 5;

    countdownTimerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(countdownTimerRef.current!);
          return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    autoContinueTimerRef.current = setTimeout(() => {
      if (!userInteractedRef.current) {
        onComplete();
      }
    }, 5000);
  }, []);

  const stopTimer = useCallback(() => {
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    pausedTimeLeftRef.current = timer.timeLeft;
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, [timer.timeLeft]);

  const resumeTimer = useCallback((onComplete: () => void) => {
    if (timer.isPaused && !userInteractedRef.current && timer.activeStepIndex !== null) {
      const remainingTime = pausedTimeLeftRef.current * 1000;
      
      countdownTimerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(countdownTimerRef.current!);
            return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      
      autoContinueTimerRef.current = setTimeout(() => {
        if (!userInteractedRef.current) {
          onComplete();
        }
      }, remainingTime);
      
      setTimer(prev => ({
        ...prev,
        isRunning: true,
        isPaused: false,
      }));
    }
  }, [timer.isPaused, timer.activeStepIndex]);

  const resetTimer = useCallback(() => {
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 5,
      activeStepIndex: null,
    });
  }, []);

  const markUserInteraction = useCallback(() => {
    userInteractedRef.current = true;
  }, []);

  useEffect(() => {
    return () => {
      if (autoContinueTimerRef.current) {
        clearTimeout(autoContinueTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  return {
    timer,
    startTimer,
    stopTimer,
    resumeTimer,
    resetTimer,
    markUserInteraction,
  };
};

const useWorkflowData = () => {
  const [storyOutline, setStoryOutline] = useState<StoryOutlineResponse | null>(null);
  const [persona, setPersona] = useState<PersonaResponse | null>(null);
  const [script, setScript] = useState<ScriptResponse | null>(null);

  return {
    storyOutline,
    persona,
    script,
    setStoryOutline,
    setPersona,
    setScript,
  };
};

const useStepExecution = (
  steps: WorkflowStep[],
  currentStepIndex: number,
  workflowData: ReturnType<typeof useWorkflowData>,
  onDataReceived: (stepIndex: number, fullText: string) => void,
  onError: (stepIndex: number, error: string) => void,
  onAudioReady: (audioUrl: string) => void,
  onMetadataReady: (metadata: { title: string; description: string }) => void,
  onThumbnailReady: (thumbnail: string) => void,
  prompt: string | null,
  config: WorkflowConfig = {}
) => {
  const executeStep = useCallback(async (stepIndex: number) => {
    const step = steps[stepIndex];
    
    if (!step) {
      return;
    }

    try {
      switch (stepIndex) {
        case 0: // Story Outline
          if (!prompt) {
            throw new Error('No prompt provided for story outline generation');
          }
          const storyOutline = await getStoryOutline(prompt);
          workflowData.setStoryOutline(storyOutline);
          onDataReceived(stepIndex, storyOutline.plot_outline);
          break;

        case 1: // Persona
          if (!workflowData.storyOutline) {
            throw new Error('No story outline data available');
          }
          const persona = await getPersona(workflowData.storyOutline);
          workflowData.setPersona(persona);
          
          const formattedPersona = Object.values(persona).map((char) =>
            `**${char.name}**\nAge: ${char.age}\nGender: ${char.gender}\nBackground: ${char.background}\nPersonality Traits: ${char.personality_traits}`
          ).join('\n\n');
          onDataReceived(stepIndex, formattedPersona);
          break;

        case 2: // Script
          if (!workflowData.storyOutline || !workflowData.persona) {
            throw new Error('Missing story outline or persona data');
          }
          const language = config.language || 'hindi'; // Default to hindi if not specified
          const script = await getScript(language, workflowData.storyOutline, workflowData.persona);
          workflowData.setScript(script);
          
          const formattedScript = script.script.map((line) =>
            `**${line.speaker}:** ${line.text}\n`
          ).join('\n');
          onDataReceived(stepIndex, formattedScript);
          break;

        case 3: // Audio + Metadata + Thumbnail
          if (!workflowData.script) {
            throw new Error('Script data not available for audio generation.');
          }
          if (!workflowData.persona) {
            throw new Error('Persona data not available for audio generation.');
          }
          if (!workflowData.storyOutline) {
            throw new Error('Story outline data not available for metadata generation.');
          }

          // Generate audio, metadata, and thumbnail in parallel
          const [audio, metadata, thumbnail] = await Promise.all([
            getAudio(config.language || 'hindi', workflowData.script.script, workflowData.persona),
            getMetadata(workflowData.storyOutline.plot_outline, config.language || 'hindi'),
            getThumbnail(workflowData.storyOutline.plot_outline, workflowData.storyOutline.setting, workflowData.storyOutline.style)
          ]);

          onAudioReady(audio.audio_url);
          onMetadataReady(metadata);
          onThumbnailReady(`data:image/png;base64,${thumbnail.imageBase64}`);
          onDataReceived(stepIndex, WORKFLOW_STEPS_DATA[stepIndex].content);
          break;

        default:
          // For non-API steps, we can just use the default content
          onDataReceived(stepIndex, WORKFLOW_STEPS_DATA[stepIndex].content);
          break;
      }
    } catch (error) {
      onError(stepIndex, error instanceof Error ? error.message : 'Unknown error');
    }
  }, [steps, workflowData, onDataReceived, onError, onAudioReady, onMetadataReady, onThumbnailReady, prompt, config.language]);

  return { executeStep };
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useWorkflow = (prompt: string | null, config: WorkflowConfig = {}): UseWorkflowReturn => {
  const [steps, setSteps] = useState<WorkflowStep[]>(initializeSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlanning, setIsPlanning] = useState(true);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ title: string; description: string } | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const workflowData = useWorkflowData();
  const {
    timer: autoContinueTimer,
    startTimer,
    stopTimer,
    resumeTimer,
    resetTimer,
    markUserInteraction,
  } = useAutoContinueTimer();
  
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // STEP MANAGEMENT
  // ============================================================================

  const updateStep = useCallback((stepIndex: number, updates: Partial<WorkflowStep>) => {
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, ...updates } : step
    ));
  }, []);

  // ============================================================================
  // WORKFLOW PROGRESSION
  // ============================================================================

  const handleContinue = useCallback((indexToContinueFrom: number) => {
    resetTimer();
    updateStep(indexToContinueFrom, { isExpanded: false });
    setCurrentStepIndex(prev => prev + 1);
  }, [resetTimer, updateStep]);

  const completeStep = useCallback((stepIndex: number) => {
    updateStep(stepIndex, {
      status: WORKFLOW_STATUS.COMPLETED,
      isExpanded: true,
    });

    if (stepIndex < steps.length - 1) {
      startTimer(stepIndex, () => handleContinue(stepIndex));
    } else {
      setIsWorkflowComplete(true);
    }
  }, [steps.length, startTimer, handleContinue, updateStep]);
  
  const streamLoaderText = useCallback((stepIndex: number, loaderText: string, onComplete: () => void) => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    updateStep(stepIndex, { streamedContent: '' });

    const startTime = Date.now();
    const streamingSpeed = WORKFLOW_CONFIG.streamingSpeed;

    streamIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const charsToShow = Math.floor(elapsedTime / streamingSpeed);

      if (charsToShow >= loaderText.length) {
        clearInterval(streamIntervalRef.current!);
        streamIntervalRef.current = null;
        updateStep(stepIndex, { streamedContent: loaderText });
        onComplete();
        return;
      }

      updateStep(stepIndex, { streamedContent: loaderText.slice(0, charsToShow) });
    }, 40); // Update roughly 25 times per second
  }, [updateStep]);

  const onDataReceived = useCallback((stepIndex: number, fullText: string) => {
    if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
    }

    updateStep(stepIndex, { streamedContent: '' });

    const startTime = Date.now();
    const streamingSpeed = WORKFLOW_CONFIG.streamingSpeed;

    streamIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const charsToShow = Math.floor(elapsedTime / streamingSpeed);

      if (charsToShow >= fullText.length) {
        clearInterval(streamIntervalRef.current!);
        streamIntervalRef.current = null;
        updateStep(stepIndex, { streamedContent: fullText });
        completeStep(stepIndex);
        return;
      }

      updateStep(stepIndex, { streamedContent: fullText.slice(0, charsToShow) });
    }, 40); // Update roughly 25 times per second
  }, [completeStep, updateStep]);

  const handleStepError = useCallback((stepIndex: number, error: string) => {
    console.error(`Step ${stepIndex} failed:`, error);
    
    updateStep(stepIndex, {
      streamedContent: `❌ **Error occurred:** ${error}\n\n**Possible solutions:**\n• Check your internet connection\n• Try again with a different prompt\n• Contact support if the issue persists`,
      status: WORKFLOW_STATUS.COMPLETED,
      isExpanded: true,
    });
    
    // Don't auto-continue on error, let user decide
    markUserInteraction();
    completeStep(stepIndex);
  }, [updateStep, completeStep, markUserInteraction]);

  const stepExecution = useStepExecution(
    steps,
    currentStepIndex,
    workflowData,
    onDataReceived,
    handleStepError,
    setAudioUrl,
    setMetadata,
    setThumbnail,
    prompt,
    config
  );

  const handleRetry = useCallback((indexToRetry: number) => {
    resetTimer();
    markUserInteraction();
    setIsWorkflowComplete(false);

    setSteps(prev => prev.map((step, i) => {
      if (i >= indexToRetry) {
        return {
          ...WORKFLOW_STEPS_DATA[i],
          status: WORKFLOW_STATUS.PENDING,
          streamedContent: '',
          isVisible: true,
          isExpanded: i === indexToRetry,
        };
      }
      return step;
    }));

    setCurrentStepIndex(indexToRetry);
  }, [resetTimer, markUserInteraction]);

  // ============================================================================
  // USER INTERACTIONS
  // ============================================================================

  const handleToggleExpand = useCallback((indexToToggle: number) => {
    setSteps(prev => prev.map((step, index) => {
      if (index === indexToToggle && step.status === WORKFLOW_STATUS.COMPLETED) {
        return { ...step, isExpanded: !step.isExpanded };
      }
      return step;
    }));
  }, []);

  const handleImproveClick = useCallback(() => {
    resetTimer();
    markUserInteraction();
  }, [resetTimer, markUserInteraction]);

  const handleImprove = useCallback((indexToImprove: number, feedback: string) => {
    console.log(`Feedback for step ${indexToImprove} ("${steps[indexToImprove].title}"): ${feedback}`);
  }, [steps]);

  const handleStopTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const handleResumeTimer = useCallback(() => {
    resumeTimer(() => handleContinue(autoContinueTimer.activeStepIndex!));
  }, [resumeTimer, handleContinue, autoContinueTimer.activeStepIndex]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Planning phase
  useEffect(() => {
    const timer = setTimeout(() => setIsPlanning(false), WORKFLOW_CONFIG.planningDelay);
    return () => clearTimeout(timer);
  }, []);

  // Step reveal animation
  useEffect(() => {
    if (isPlanning) return;

    const interval = setInterval(() => {
      setSteps(prev => {
        const nextInvisibleIndex = prev.findIndex(s => !s.isVisible);
        
        if (nextInvisibleIndex !== -1) {
          const newSteps = [...prev];
          newSteps[nextInvisibleIndex].isVisible = true;
          return newSteps;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, WORKFLOW_CONFIG.stepRevealDelay);

    return () => clearInterval(interval);
  }, [isPlanning]);

  // Step execution
  useEffect(() => {
    if (isPlanning || !prompt || currentStepIndex >= steps.length) {
      return;
    }

    const currentStep = steps[currentStepIndex];

    if (currentStep?.isVisible && currentStep.status === WORKFLOW_STATUS.PENDING) {
      const timer = setTimeout(() => {
        updateStep(currentStepIndex, {
          status: WORKFLOW_STATUS.IN_PROGRESS,
          isExpanded: true,
        });
        
        const loaderText = currentStep.loaderContent[Math.floor(Math.random() * currentStep.loaderContent.length)];
        streamLoaderText(currentStepIndex, loaderText, () => {
          stepExecution.executeStep(currentStepIndex);
        });
      }, WORKFLOW_CONFIG.stepStartDelay);
      return () => clearTimeout(timer);
    }
  }, [isPlanning, prompt, currentStepIndex, steps, updateStep, stepExecution, streamLoaderText]);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Final completion
  useEffect(() => {
    if (isWorkflowComplete) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(s => ({ ...s, isExpanded: false })));
      }, WORKFLOW_CONFIG.collapseDelay);
      return () => clearTimeout(timer);
    }
  }, [isWorkflowComplete]);

  return {
    steps,
    currentStepIndex,
    isPlanning,
    isWorkflowComplete,
    autoContinueTimer,
    handleToggleExpand,
    handleRetry,
    handleContinue,
    handleImprove,
    handleImproveClick,
    handleStopTimer,
    handleResumeTimer,
    audioUrl,
    metadata,
    thumbnail,
  };
}; 