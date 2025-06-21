import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowStep, WorkflowStepData } from '../types/chat';
import { WORKFLOW_STEPS_DATA, WORKFLOW_CONFIG, WORKFLOW_STATUS } from '../constants/workflow';

interface UseWorkflowReturn {
  steps: WorkflowStep[];
  currentStepIndex: number;
  isPlanning: boolean;
  isWorkflowComplete: boolean;
  handleToggleExpand: (indexToToggle: number) => void;
  handleRetry: (indexToRetry: number) => void;
  handleContinue: (indexToContinueFrom: number) => void;
  handleImprove: (indexToImprove: number, feedback: string) => void;
}

export const useWorkflow = (prompt: string | null): UseWorkflowReturn => {
  const [steps, setSteps] = useState<WorkflowStep[]>(
    WORKFLOW_STEPS_DATA.map((s: WorkflowStepData) => ({
      ...s,
      status: WORKFLOW_STATUS.PENDING,
      streamedContent: "",
      isExpanded: false,
      isVisible: false,
    }))
  );
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlanning, setIsPlanning] = useState(true);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const charIndexRef = useRef(0);

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
          if (currentStepIndex === steps.length - 1) {
            setIsWorkflowComplete(true);
          }
        }, WORKFLOW_CONFIG.completionDelay);
      }
    }, WORKFLOW_CONFIG.streamingSpeed);

    return () => clearInterval(intervalId);
  }, [statusOfCurrentStep, currentStepIndex, steps.length]);

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
    setSteps(prev =>
      prev.map((step, i) =>
        i === indexToContinueFrom ? { ...step, isExpanded: false } : step
      )
    );
    setCurrentStepIndex(prev => prev + 1);
  }, []);

  const handleImprove = useCallback((indexToImprove: number, feedback: string) => {
    console.log(`Feedback for step ${indexToImprove} ("${steps[indexToImprove].title}"): ${feedback}`);
    // Here you could add logic to re-run the step with the new feedback
  }, [steps]);

  return {
    steps,
    currentStepIndex,
    isPlanning,
    isWorkflowComplete,
    handleToggleExpand,
    handleRetry,
    handleContinue,
    handleImprove,
  };
}; 