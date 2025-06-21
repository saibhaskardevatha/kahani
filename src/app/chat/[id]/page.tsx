"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const workflowStepsData = [
  {
    title: 'Creating Story Outline',
    content: `Based on your prompt, we're building a narrative structure. The story will begin with the initial discovery, introduce a central conflict with a **rival organization**, and build towards a climactic confrontation. Key scenes will include a chase through a bustling market, a moment of betrayal, and the final puzzle-solving sequence in a **hidden chamber**.`,
  },
  {
    title: 'Generating Characters',
    content: `1. **Protagonist:** A brilliant but reckless adventurer, driven by a personal connection to the central mystery.\n2. **Ally:** A cautious and knowledgeable local expert who provides crucial guidance and acts as a moral compass.\n3. **Antagonist:** A ruthless and well-funded collector who seeks the prize for their own nefarious purposes.`,
  },
  {
    title: 'Generating Script for the Story',
    content: `**SCENE 1: THE DISCOVERY**\nAn ancient map is found, hinting at a legendary artifact. Our hero is introduced, along with their motivations.\n\n**SCENE 2: THE CONFLICT**\nThe antagonist learns of the discovery and sets their plan in motion, creating the first obstacle.\n\n**SCENE 3: THE CLIMAX**\nBoth parties converge at the final location. A battle of wits and will ensues, with the fate of the artifact hanging in the balance.`,
  },
  {
    title: 'Generating Audios',
    content: `[INFO] Generating ambient soundscapes...\n[INFO] Synthesizing character voices...\n[INFO] Composing original score...\n[SUCCESS] Audio assets generated. Mixing and mastering in progress...\n[COMPLETE] Your immersive audio experience is ready.`,
  },
];

const SimpleMarkdownRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={index} className="font-semibold text-slate-800 dark:text-slate-200">{segment.substring(2, segment.length - 2)}</strong>;
        }
        return <span key={index}>{segment}</span>;
      })}
    </>
  );
};

const WorkflowStep = ({ title, status, content, isLast, isExpanded, onToggleExpand, isVisible }: { title: string; status: string; content: string; isLast: boolean; isExpanded: boolean; onToggleExpand: () => void; isVisible: boolean; }) => {
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';
  const showContent = isInProgress || isExpanded;
  const canToggle = isCompleted;

  return (
    <div className={`flex gap-4 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {/* Left Gutter: Dot and Line */}
      <div className="flex flex-col items-center">
        <div 
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all duration-300 ${
            isCompleted ? 'bg-green-500' : 
            isInProgress ? 'bg-blue-500 animate-pulse' : 
            'bg-slate-300 dark:bg-slate-600'
          }`}
        ></div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-2"></div>}
      </div>

      {/* Right side: Title and Content */}
      <div className="flex-1 pb-4">
        <div 
          className={`flex items-center justify-between ${canToggle ? 'cursor-pointer group' : ''}`}
          onClick={canToggle ? onToggleExpand : undefined}
        >
          <p className={`text-sm font-medium ${isCompleted || isInProgress ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
            {title}
          </p>
          {canToggle && (
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        
        <div 
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: showContent && content ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="mt-2 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-sm">
                <SimpleMarkdownRenderer text={content} />
                {isInProgress && <span className="inline-block w-1.5 h-4 bg-slate-700 dark:bg-white animate-pulse ml-1 align-bottom"></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Generated Episodes
      </h2>
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="cursor-pointer w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex items-center justify-center"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex items-center justify-center"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">Episode 1</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">The Beginning</p>
          </div>
        </div>
        
        <div className="flex items-end gap-1.5 h-6 w-24">
          {isPlaying ? (
              [...Array(7)].map((_, i) => (
                  <span key={i} className="w-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms`, height: `${(i % 3 + 2) * 6}px` }}></span>
              ))
          ) : (
              [...Array(7)].map((_, i) => (
                  <span key={i} className="w-1 bg-slate-300 dark:bg-slate-600 rounded-full" style={{ height: '4px' }}></span>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get('prompt');
  
  const [steps, setSteps] = useState(workflowStepsData.map(s => ({ ...s, status: 'pending', streamedContent: '', isExpanded: false, isVisible: false })));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlanning, setIsPlanning] = useState(true);
  const charIndexRef = useRef(0);
  const isWorkflowComplete = currentStepIndex >= steps.length;

  // Effect for initial "Planning..." phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlanning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Effect to reveal steps one by one after planning
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
    }, 200); // Stagger delay

    return () => clearInterval(interval);
  }, [isPlanning]);

  // Effect to kick off the process for the current step, once it's visible
  useEffect(() => {
    if (isPlanning || !prompt || isWorkflowComplete) return;

    const currentStepData = steps[currentStepIndex];
    if (currentStepData && currentStepData.isVisible && currentStepData.status === 'pending') {
      const timer = setTimeout(() => {
        setSteps(prev => 
          prev.map((step, index) =>
            index === currentStepIndex ? { ...step, status: 'in-progress', isExpanded: true } : step
          )
        );
      }, 300); // Small delay after becoming visible before starting
      return () => clearTimeout(timer);
    }
  }, [isPlanning, prompt, currentStepIndex, isWorkflowComplete, steps]);

  // Effect to handle the streaming animation
  const statusOfCurrentStep = steps[currentStepIndex]?.status;
  useEffect(() => {
    if (statusOfCurrentStep !== 'in-progress') return;

    charIndexRef.current = 0;
    const contentToStream = workflowStepsData[currentStepIndex].content;

    const intervalId = setInterval(() => {
      charIndexRef.current++;
      const streamedText = contentToStream.slice(0, charIndexRef.current);
      setSteps(prevSteps =>
        prevSteps.map((step, index) =>
          index === currentStepIndex ? { ...step, streamedContent: streamedText } : step
        )
      );

      if (charIndexRef.current >= contentToStream.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setSteps(prevSteps => 
            prevSteps.map((step, index) =>
              index === currentStepIndex ? { ...step, status: 'completed' } : step
            )
          );
          setCurrentStepIndex(prev => prev + 1);
        }, 300);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [statusOfCurrentStep, currentStepIndex]);

  // Effect to collapse all steps on completion
  useEffect(() => {
    if (isWorkflowComplete) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(s => ({...s, isExpanded: false})));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isWorkflowComplete]);

  const handleToggleExpand = (indexToToggle: number) => {
    setSteps(prevSteps =>
      prevSteps.map((step, index) => {
        if (index === indexToToggle && step.status === 'completed') {
          return { ...step, isExpanded: !step.isExpanded };
        }
        return step;
      })
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Prompt Section */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your Storyline</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {prompt || 'No prompt provided'}
            </h1>
          </div>

          {/* Workflow Section */}
          {isPlanning ? (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 pt-2">
              <div className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Planning...</span>
            </div>
          ) : (
            <div className="relative">
              {steps.map((step, index) => (
                <WorkflowStep 
                  key={index}
                  title={step.title}
                  status={step.status}
                  content={step.streamedContent}
                  isLast={index === steps.length - 1}
                  isExpanded={step.isExpanded}
                  onToggleExpand={() => handleToggleExpand(index)}
                  isVisible={step.isVisible}
                />
              ))}
              {isWorkflowComplete && <AudioPlayer />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 