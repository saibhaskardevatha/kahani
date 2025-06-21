import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowStep, WorkflowStepData } from '../types/chat';
import { WORKFLOW_STEPS_DATA, WORKFLOW_CONFIG, WORKFLOW_STATUS } from '../constants/workflow';
import { getStoryOutline, getPersona, getScript, StoryOutlineResponse, PersonaResponse } from '../lib/api';

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
    timeLeft: 10,
    activeStepIndex: null,
  });

  const autoContinueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pausedTimeLeftRef = useRef(10);
  const userInteractedRef = useRef(false);

  const startTimer = useCallback((stepIndex: number, onComplete: () => void) => {
    userInteractedRef.current = false;
    setTimer({
      isRunning: true,
      isPaused: false,
      timeLeft: 10,
      activeStepIndex: stepIndex,
    });
    pausedTimeLeftRef.current = 10;

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
    }, 10000);
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
      timeLeft: 10,
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

  return {
    storyOutline,
    persona,
    setStoryOutline,
    setPersona,
  };
};

const useStepExecution = (
  steps: WorkflowStep[],
  currentStepIndex: number,
  workflowData: ReturnType<typeof useWorkflowData>,
  onStepComplete: (stepIndex: number) => void,
  onError: (stepIndex: number, error: string) => void,
  prompt: string | null,
  updateStepContent: (stepIndex: number, content: string) => void,
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
          
          updateStepContent(stepIndex, storyOutline.plot_outline);
          
          onStepComplete(stepIndex);
          break;

        case 1: // Persona
          if (!workflowData.storyOutline) {
            throw new Error('No story outline data available');
          }
          const persona = await getPersona(workflowData.storyOutline);
          workflowData.setPersona(persona);
          
          // Update step content with actual persona data
          const formattedPersona = Object.values(persona).map((char) =>
            `**${char.name}**\nAge: ${char.age}\nGender: ${char.gender}\nBackground: ${char.background}\nPersonality Traits: ${char.personality_traits}`
          ).join('\n\n');
          updateStepContent(stepIndex, formattedPersona);
          
          onStepComplete(stepIndex);
          break;

        case 2: // Script
          if (!workflowData.storyOutline || !workflowData.persona) {
            throw new Error('Missing story outline or persona data');
          }
          const language = config.language || 'hindi'; // Default to hindi if not specified
          const script = await getScript(language, workflowData.storyOutline, workflowData.persona);
          
          // Update step content with actual script data
          const formattedScript = script.script.map((line) =>
            `**${line.speaker}:** ${line.text}\n_voice: ${line.voice_config.voice_model}, pitch: ${line.voice_config.pitch}, pace: ${line.voice_config.pace}, loudness: ${line.voice_config.loudness}_`
          ).join('\n\n');
          updateStepContent(stepIndex, formattedScript);
          
          onStepComplete(stepIndex);
          break;

        default:
          // Mock streaming for other steps
          setTimeout(() => onStepComplete(stepIndex), WORKFLOW_CONFIG.completionDelay);
          break;
      }
    } catch (error) {
      onError(stepIndex, error instanceof Error ? error.message : 'Unknown error');
    }
  }, [steps, workflowData, onStepComplete, onError, prompt, updateStepContent, config.language]);

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

  const workflowData = useWorkflowData();
  const {
    timer: autoContinueTimer,
    startTimer,
    stopTimer,
    resumeTimer,
    resetTimer,
    markUserInteraction,
  } = useAutoContinueTimer();

  // ============================================================================
  // STEP MANAGEMENT
  // ============================================================================

  const updateStep = useCallback((stepIndex: number, updates: Partial<WorkflowStep>) => {
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, ...updates } : step
    ));
  }, []);

  const updateStepContent = useCallback((stepIndex: number, content: string) => {
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, streamedContent: content } : step
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
    completeStep,
    handleStepError,
    prompt,
    updateStepContent,
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
        stepExecution.executeStep(currentStepIndex);
      }, WORKFLOW_CONFIG.stepStartDelay);
      return () => clearTimeout(timer);
    }
  }, [isPlanning, prompt, currentStepIndex, steps, updateStep, stepExecution]);

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
  };
}; 