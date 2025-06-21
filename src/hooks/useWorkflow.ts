import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowStep, WorkflowStepData } from '../types/chat';
import { WORKFLOW_STEPS_DATA, WORKFLOW_CONFIG, WORKFLOW_STATUS } from '../constants/workflow';
import { getStoryOutline, StoryOutlineResponse } from '../lib/api';

interface UseWorkflowReturn {
  steps: WorkflowStep[];
  currentStepIndex: number;
  isPlanning: boolean;
  isWorkflowComplete: boolean;
  autoContinueTimer: {
    isRunning: boolean;
    isPaused: boolean;
    timeLeft: number;
    activeStepIndex: number | null;
  };
  handleToggleExpand: (indexToToggle: number) => void;
  handleRetry: (indexToRetry: number) => void;
  handleContinue: (indexToContinueFrom: number) => void;
  handleImprove: (indexToImprove: number, feedback: string) => void;
  handleImproveClick: (indexToImprove: number) => void;
  handleStopTimer: () => void;
  handleResumeTimer: () => void;
}

export const useWorkflow = (prompt: string | null): UseWorkflowReturn => {
  const [steps, setSteps] = useState<WorkflowStep[]>(
    WORKFLOW_STEPS_DATA.map((s: WorkflowStepData, idx: number) => ({
      ...s,
      status: WORKFLOW_STATUS.PENDING,
      streamedContent: idx === 0 ? '' : s.content,
      isExpanded: false,
      isVisible: false,
    }))
  );
  const [storyOutlineLoading, setStoryOutlineLoading] = useState(false);
  const [storyOutlineError, setStoryOutlineError] = useState<string | null>(null);
  const [storyOutlineData, setStoryOutlineData] = useState<StoryOutlineResponse | null>(null);
  const [personaData, setPersonaData] = useState<any | null>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlanning, setIsPlanning] = useState(true);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const [autoContinueTimer, setAutoContinueTimer] = useState({
    isRunning: false,
    isPaused: false,
    timeLeft: 10,
    activeStepIndex: null as number | null,
  });

  const charIndexRef = useRef(0);
  const autoContinueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const pausedTimeLeftRef = useRef(10);

  // Effect for initial "Planning..." phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlanning(false);
    }, WORKFLOW_CONFIG.planningDelay);
    return () => clearTimeout(timer);
  }, []);

  // Effect to reveal steps one by one after planning
  useEffect(() => {
    if (isPlanning) return;

    const interval = setInterval(() => {
      setSteps((prev) => {
        const nextInvisibleIndex = prev.findIndex((s) => !s.isVisible);
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

  // Effect to kick off the process for the current step, once it's visible
  useEffect(() => {
    if (isPlanning || !prompt || currentStepIndex >= steps.length) return;

    const currentStepData = steps[currentStepIndex];
    if (
      currentStepData &&
      currentStepData.isVisible &&
      currentStepData.status === WORKFLOW_STATUS.PENDING
    ) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, index) =>
            index === currentStepIndex
              ? { ...step, status: WORKFLOW_STATUS.IN_PROGRESS, isExpanded: true }
              : step
          )
        );
      }, WORKFLOW_CONFIG.stepStartDelay);
      return () => clearTimeout(timer);
    }
  }, [isPlanning, prompt, currentStepIndex, steps]);

  // Effect to handle the streaming animation
  const statusOfCurrentStep = steps[currentStepIndex]?.status;
  useEffect(() => {
    // Step 1: Story Outline (already implemented above)
    if (currentStepIndex === 0 && statusOfCurrentStep === WORKFLOW_STATUS.IN_PROGRESS && prompt) {
      setStoryOutlineLoading(true);
      setStoryOutlineError(null);
      getStoryOutline(prompt)
        .then((data) => {
          setStoryOutlineData(data);
          const formatted = data.plot_outline;
          setSteps((prev) => prev.map((step, idx) => idx === 0 ? { ...step, streamedContent: formatted } : step));
        })
        .catch((e) => {
          setStoryOutlineError(e.message || 'Failed to fetch story outline');
          setSteps((prev) => prev.map((step, idx) => idx === 0 ? { ...step, streamedContent: 'Error: Failed to fetch story outline.' } : step));
        })
        .finally(() => {
          setStoryOutlineLoading(false);
          setTimeout(() => {
            setSteps((prev) => prev.map((step, idx) => idx === 0 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
            if (currentStepIndex < steps.length - 1) {
              userInteractedRef.current = false;
              setAutoContinueTimer({
                isRunning: true,
                isPaused: false,
                timeLeft: 10,
                activeStepIndex: currentStepIndex,
              });
              pausedTimeLeftRef.current = 10;
              countdownTimerRef.current = setInterval(() => {
                setAutoContinueTimer(prev => {
                  if (prev.timeLeft <= 1) {
                    clearInterval(countdownTimerRef.current!);
                    return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                  }
                  return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
              }, 1000);
              autoContinueTimerRef.current = setTimeout(() => {
                if (!userInteractedRef.current) {
                  handleContinue(currentStepIndex);
                }
              }, 10000);
            } else {
              setIsWorkflowComplete(true);
            }
          }, WORKFLOW_CONFIG.completionDelay);
        });
      return;
    }
    // Step 2: Persona API integration
    if (currentStepIndex === 1 && statusOfCurrentStep === WORKFLOW_STATUS.IN_PROGRESS) {
      // Only proceed if we have the storyline output
      if (!storyOutlineData) {
        setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, streamedContent: 'Error: No story outline data available.' } : step));
        setTimeout(() => {
          setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
          if (currentStepIndex < steps.length - 1) {
            userInteractedRef.current = false;
            setAutoContinueTimer({
              isRunning: true,
              isPaused: false,
              timeLeft: 10,
              activeStepIndex: currentStepIndex,
            });
            pausedTimeLeftRef.current = 10;
            countdownTimerRef.current = setInterval(() => {
              setAutoContinueTimer(prev => {
                if (prev.timeLeft <= 1) {
                  clearInterval(countdownTimerRef.current!);
                  return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
              });
            }, 1000);
            autoContinueTimerRef.current = setTimeout(() => {
              if (!userInteractedRef.current) {
                handleContinue(currentStepIndex);
              }
            }, 10000);
          } else {
            setIsWorkflowComplete(true);
          }
        }, WORKFLOW_CONFIG.completionDelay);
        return;
      }
      // Show loading state
      setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, streamedContent: 'Loading character personas...' } : step));
      import('../lib/api').then(({ getPersona }) => {
        getPersona(storyOutlineData)
          .then((personaObj) => {
            setPersonaData(personaObj); // save the raw persona response
            const formatted = Object.entries(personaObj).map(([key, char]) =>
              `**${char.name}**\nAge: ${char.age}\nGender: ${char.gender}\nBackground: ${char.background}\nPersonality Traits: ${char.personality_traits}`
            ).join('\n\n');
            setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, streamedContent: formatted } : step));
          })
          .catch((e) => {
            setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, streamedContent: 'Error: Failed to fetch persona.' } : step));
          })
          .finally(() => {
            setTimeout(() => {
              setSteps((prev) => prev.map((step, idx) => idx === 1 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
              if (currentStepIndex < steps.length - 1) {
                userInteractedRef.current = false;
                setAutoContinueTimer({
                  isRunning: true,
                  isPaused: false,
                  timeLeft: 10,
                  activeStepIndex: currentStepIndex,
                });
                pausedTimeLeftRef.current = 10;
                countdownTimerRef.current = setInterval(() => {
                  setAutoContinueTimer(prev => {
                    if (prev.timeLeft <= 1) {
                      clearInterval(countdownTimerRef.current!);
                      return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                  });
                }, 1000);
                autoContinueTimerRef.current = setTimeout(() => {
                  if (!userInteractedRef.current) {
                    handleContinue(currentStepIndex);
                  }
                }, 10000);
              } else {
                setIsWorkflowComplete(true);
              }
            }, WORKFLOW_CONFIG.completionDelay);
          });
      });
      return;
    }
    // Step 3: Script Generation API integration
    if (currentStepIndex === 2 && statusOfCurrentStep === WORKFLOW_STATUS.IN_PROGRESS) {
      // Only proceed if we have the storyline and persona output
      if (!storyOutlineData || !steps[1].streamedContent) {
        setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, streamedContent: 'Error: Missing story outline or persona data.' } : step));
        setTimeout(() => {
          setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
          if (currentStepIndex < steps.length - 1) {
            userInteractedRef.current = false;
            setAutoContinueTimer({
              isRunning: true,
              isPaused: false,
              timeLeft: 10,
              activeStepIndex: currentStepIndex,
            });
            pausedTimeLeftRef.current = 10;
            countdownTimerRef.current = setInterval(() => {
              setAutoContinueTimer(prev => {
                if (prev.timeLeft <= 1) {
                  clearInterval(countdownTimerRef.current!);
                  return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
              });
            }, 1000);
            autoContinueTimerRef.current = setTimeout(() => {
              if (!userInteractedRef.current) {
                handleContinue(currentStepIndex);
              }
            }, 10000);
          } else {
            setIsWorkflowComplete(true);
          }
        }, WORKFLOW_CONFIG.completionDelay);
        return;
      }
      // Show loading state
      setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, streamedContent: 'Generating script...' } : step));
      import('../lib/api').then(({ getScript }) => {
        // Log the objects being sent to the script API
        // eslint-disable-next-line no-console
        console.log('SCRIPT API CALL INPUT:', {
          language: 'hindi',
          story_outline: storyOutlineData,
          persona: personaData,
        });
        // Defensive: if either is missing, show error and their values
        if (!storyOutlineData || !personaData) {
          setSteps((prev) => prev.map((step, idx) => idx === 2 ? {
            ...step,
            streamedContent: 'Error: Missing data for script API.\n' +
              'storyOutlineData: ' + JSON.stringify(storyOutlineData, null, 2) + '\n' +
              'personaData: ' + JSON.stringify(personaData, null, 2)
          } : step));
          setTimeout(() => {
            setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
          }, WORKFLOW_CONFIG.completionDelay);
          return;
        }
        getScript('hindi', storyOutlineData, personaData)
          .then((scriptData) => {
            // Format script output for display
            const formatted = scriptData.script.map((line, idx) =>
              `**${line.speaker}:** ${line.text}\n_voice: ${line.voice_config.voice_model}, pitch: ${line.voice_config.pitch}, pace: ${line.voice_config.pace}, loudness: ${line.voice_config.loudness}_`
            ).join('\n\n');
            setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, streamedContent: formatted } : step));
          })
          .catch((e) => {
            setSteps((prev) => prev.map((step, idx) => idx === 2 ? {
              ...step,
              streamedContent: 'Error: Failed to fetch script.\n' +
                'storyOutlineData: ' + JSON.stringify(storyOutlineData, null, 2) + '\n' +
                'personaData: ' + JSON.stringify(personaData, null, 2)
            } : step));
          })
          .finally(() => {
            setTimeout(() => {
              setSteps((prev) => prev.map((step, idx) => idx === 2 ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true } : step));
              if (currentStepIndex < steps.length - 1) {
                userInteractedRef.current = false;
                setAutoContinueTimer({
                  isRunning: true,
                  isPaused: false,
                  timeLeft: 10,
                  activeStepIndex: currentStepIndex,
                });
                pausedTimeLeftRef.current = 10;
                countdownTimerRef.current = setInterval(() => {
                  setAutoContinueTimer(prev => {
                    if (prev.timeLeft <= 1) {
                      clearInterval(countdownTimerRef.current!);
                      return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                  });
                }, 1000);
                autoContinueTimerRef.current = setTimeout(() => {
                  if (!userInteractedRef.current) {
                    handleContinue(currentStepIndex);
                  }
                }, 10000);
              } else {
                setIsWorkflowComplete(true);
              }
            }, WORKFLOW_CONFIG.completionDelay);
          });
      });
      return;
    }
    // For other steps, use the mock streaming animation
    if (statusOfCurrentStep !== WORKFLOW_STATUS.IN_PROGRESS) return;
    charIndexRef.current = 0;
    const contentToStream = WORKFLOW_STEPS_DATA[currentStepIndex].content;
    const intervalId = setInterval(() => {
      charIndexRef.current++;
      const streamedText = contentToStream.slice(0, charIndexRef.current);
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === currentStepIndex
            ? { ...step, streamedContent: streamedText }
            : step
        )
      );
      if (charIndexRef.current >= contentToStream.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setSteps((prevSteps) =>
            prevSteps.map((step, index) =>
              index === currentStepIndex
                ? { ...step, status: WORKFLOW_STATUS.COMPLETED, isExpanded: true }
                : step
            )
          );
          if (currentStepIndex < steps.length - 1) {
            userInteractedRef.current = false;
            setAutoContinueTimer({
              isRunning: true,
              isPaused: false,
              timeLeft: 10,
              activeStepIndex: currentStepIndex,
            });
            pausedTimeLeftRef.current = 10;
            countdownTimerRef.current = setInterval(() => {
              setAutoContinueTimer(prev => {
                if (prev.timeLeft <= 1) {
                  clearInterval(countdownTimerRef.current!);
                  return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 };
              });
            }, 1000);
            autoContinueTimerRef.current = setTimeout(() => {
              if (!userInteractedRef.current) {
                handleContinue(currentStepIndex);
              }
            }, 10000);
          } else {
            setIsWorkflowComplete(true);
          }
        }, WORKFLOW_CONFIG.completionDelay);
      }
    }, WORKFLOW_CONFIG.streamingSpeed);
    return () => clearInterval(intervalId);
  }, [statusOfCurrentStep, currentStepIndex, steps.length, prompt, storyOutlineData, personaData]);

  // Effect to collapse all steps on final completion
  useEffect(() => {
    if (isWorkflowComplete) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(s => ({...s, isExpanded: false})));
      }, WORKFLOW_CONFIG.collapseDelay);
      return () => clearTimeout(timer);
    }
  }, [isWorkflowComplete]);

  const handleToggleExpand = useCallback((indexToToggle: number) => {
    setSteps(prevSteps =>
      prevSteps.map((step, index) => {
        if (index === indexToToggle && step.status === WORKFLOW_STATUS.COMPLETED) {
          return { ...step, isExpanded: !step.isExpanded };
        }
        return step;
      })
    );
  }, []);

  const handleRetry = useCallback((indexToRetry: number) => {
    // Stop auto-continue timer and mark user interaction
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    userInteractedRef.current = true;
    setAutoContinueTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 10,
      activeStepIndex: null,
    });
    
    setIsWorkflowComplete(false);
    setSteps(prev =>
      prev.map((step, i) => {
        if (i >= indexToRetry) {
          // Reset the retried step and all subsequent steps to pending
          return { 
            ...WORKFLOW_STEPS_DATA[i], 
            status: WORKFLOW_STATUS.PENDING, 
            streamedContent: '', 
            isVisible: true, 
            isExpanded: i === indexToRetry // Only expand the step being retried
          };
        }
        // Keep previous steps as they are
        return step;
      })
    );
    setCurrentStepIndex(indexToRetry);
  }, []);
  
  const handleContinue = useCallback((indexToContinueFrom: number) => {
    // Stop auto-continue timer
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    setAutoContinueTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 10,
      activeStepIndex: null,
    });
    
    setSteps(prev =>
      prev.map((step, i) =>
        i === indexToContinueFrom ? { ...step, isExpanded: false } : step
      )
    );
    setCurrentStepIndex(prev => prev + 1);
  }, []);

  const handleImproveClick = useCallback(() => {
    // Stop auto-continue timer and mark user interaction when Improve button is clicked
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    userInteractedRef.current = true;
    setAutoContinueTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 10,
      activeStepIndex: null,
    });
  }, []);

  const handleStopTimer = useCallback(() => {
    if (autoContinueTimerRef.current) {
      clearTimeout(autoContinueTimerRef.current);
      autoContinueTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    pausedTimeLeftRef.current = autoContinueTimer.timeLeft;
    setAutoContinueTimer(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, [autoContinueTimer.timeLeft]);

  const handleResumeTimer = useCallback(() => {
    if (autoContinueTimer.isPaused && !userInteractedRef.current && autoContinueTimer.activeStepIndex !== null) {
      const remainingTime = pausedTimeLeftRef.current * 1000;
      
      // Start countdown timer
      countdownTimerRef.current = setInterval(() => {
        setAutoContinueTimer(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(countdownTimerRef.current!);
            return { ...prev, isRunning: false, timeLeft: 0, activeStepIndex: null };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      
      autoContinueTimerRef.current = setTimeout(() => {
        if (!userInteractedRef.current) {
          handleContinue(autoContinueTimer.activeStepIndex!);
        }
      }, remainingTime);
      
      setAutoContinueTimer(prev => ({
        ...prev,
        isRunning: true,
        isPaused: false,
      }));
    }
  }, [autoContinueTimer.isPaused, autoContinueTimer.activeStepIndex]);

  const handleImprove = useCallback((indexToImprove: number, feedback: string) => {
    console.log(`Feedback for step ${indexToImprove} ("${steps[indexToImprove].title}"): ${feedback}`);
    // Here you could add logic to re-run the step with the new feedback
  }, [steps]);

  // Cleanup timer on unmount
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