"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { RotateCcw, ArrowUpDown, ChevronsRight } from "lucide-react";

const workflowStepsData = [
  {
    title: "Creating Story Outline",
    content: `Based on your prompt, we're building a narrative structure. The story will begin with the initial discovery, introduce a central conflict with a **rival organization**, and build towards a climactic confrontation. Key scenes will include a chase through a bustling market, a moment of betrayal, and the final puzzle-solving sequence in a **hidden chamber**.`,
  },
  {
    title: "Generating Characters",
    content: `1. **Protagonist:** A brilliant but reckless adventurer, driven by a personal connection to the central mystery.\n2. **Ally:** A cautious and knowledgeable local expert who provides crucial guidance and acts as a moral compass.\n3. **Antagonist:** A ruthless and well-funded collector who seeks the prize for their own nefarious purposes.`,
  },
  {
    title: "Generating Script for the Story",
    content: `**SCENE 1: THE DISCOVERY**\nAn ancient map is found, hinting at a legendary artifact. Our hero is introduced, along with their motivations.\n\n**SCENE 2: THE CONFLICT**\nThe antagonist learns of the discovery and sets their plan in motion, creating the first obstacle.\n\n**SCENE 3: THE CLIMAX**\nBoth parties converge at the final location. A battle of wits and will ensues, with the fate of the artifact hanging in the balance.`,
  },
  {
    title: "Generating Audios",
    content: `[INFO] Generating ambient soundscapes...\n[INFO] Synthesizing character voices...\n[INFO] Composing original score...\n[SUCCESS] Audio assets generated. Mixing and mastering in progress...\n[COMPLETE] Your immersive audio experience is ready.`,
  },
];

const SimpleMarkdownRenderer = ({ text }: { text: string }) => {
  if (!text) return null;
  const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.startsWith("**") && segment.endsWith("**")) {
          return (
            <strong
              key={index}
              className="font-semibold text-slate-800 dark:text-slate-200"
            >
              {segment.substring(2, segment.length - 2)}
            </strong>
          );
        }
        return <span key={index}>{segment}</span>;
      })}
    </>
  );
};

const FeedbackForm = ({ onSubmit }: { onSubmit: (feedback: string) => void }) => {
    const [feedback, setFeedback] = useState('');
    return (
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What would you like to improve?"
                className="w-full p-2 rounded-md bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
            />
            <button 
                onClick={() => onSubmit(feedback)}
                className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 disabled:bg-slate-400"
                disabled={!feedback.trim()}
            >
                Submit Feedback
            </button>
        </div>
    );
};

const WorkflowStep = ({
  title,
  status,
  content,
  isLast,
  isExpanded,
  onToggleExpand,
  isVisible,
  onRetry,
  onContinue,
  onImprove,
}: {
  title: string;
  status: string;
  content: string;
  isLast: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isVisible: boolean;
  onRetry: () => void;
  onContinue: () => void;
  onImprove: (feedback: string) => void;
}) => {
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";
  const showContent = isInProgress || isExpanded;
  const canToggle = isCompleted;
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const handleImproveSubmit = (feedback: string) => {
    onImprove(feedback);
    setIsFeedbackVisible(false);
  };

  return (
    <div
      className={`flex gap-4 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {/* Left Gutter: Dot and Line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all duration-300 ${
            isCompleted
              ? "bg-green-500"
              : isInProgress
              ? "bg-blue-500 animate-pulse"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        ></div>
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-2"></div>
        )}
      </div>

      {/* Right side: Title and Content */}
      <div className="flex-1 pb-4">
        <div
          className={`flex items-center justify-between ${
            canToggle ? "cursor-pointer group" : ""
          }`}
          onClick={canToggle ? onToggleExpand : undefined}
        >
          <p
            className={`text-sm font-medium ${
              isCompleted || isInProgress
                ? "text-slate-800 dark:text-slate-200"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {title}
          </p>
          {canToggle && (
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-in-out"
          style={{ gridTemplateRows: showContent && content ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-2 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-sm">
              <SimpleMarkdownRenderer text={content} />
              {isInProgress && (
                <span className="inline-block w-1.5 h-4 bg-slate-700 dark:bg-white animate-pulse ml-1 align-middle"></span>
              )}
            </div>
            {isCompleted && (
                <div className="mt-4 border-t border-slate-200 dark:border-slate-700/60 pt-3 flex items-center gap-2 animate-in slide-in-from-top-2 duration-500 ease-out">
                    <button onClick={onRetry} title="Retry" className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-yellow-600 dark:hover:text-yellow-400 font-semibold px-2 py-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 transform">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry
                    </button>
                    <button onClick={() => setIsFeedbackVisible(!isFeedbackVisible)} title="Improve" className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 transform">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Improve
                    </button>
                    {!isLast && (
                        <button onClick={onContinue} title="Continue to Next Step" className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-600 dark:hover:text-green-400 font-semibold px-2 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 transform">
                            <ChevronsRight className="w-3.5 h-3.5" />
                            Continue
                        </button>
                    )}
                </div>
            )}
            {isFeedbackVisible && <FeedbackForm onSubmit={handleImproveSubmit} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioWaveform = ({ isPlaying }: { isPlaying: boolean }) => {
    if (!isPlaying) {
        return (
             <div className="flex items-center justify-center w-24 h-6">
                <svg width="100" height="24" viewBox="0 0 100 24">
                    <line x1="0" y1="12" x2="100" y2="12" strokeWidth="2" className="stroke-slate-300 dark:stroke-slate-600" />
                </svg>
            </div>
        );
    }

    const wavePaths = [
        {
            color: 'rgb(59 130 246 / 0.8)', // blue-500
            dur: '1.5s',
            values: 'M 0 12 C 25 0, 75 24, 100 12; M 0 12 C 25 24, 75 0, 100 12; M 0 12 C 25 0, 75 24, 100 12'
        },
        {
            color: 'rgb(99 102 241 / 0.6)', // indigo-500
            dur: '2s',
            values: 'M 0 12 C 20 24, 40 0, 60 12 C 80 24, 100 12, 100 12; M 0 12 C 20 0, 40 24, 60 12 C 80 0, 100 12, 100 12; M 0 12 C 20 24, 40 0, 60 12 C 80 24, 100 12, 100 12'
        },
        {
            color: 'rgb(236 72 153 / 0.5)', // pink-500
            dur: '1.2s',
            values: 'M 0 12 C 30 18, 70 6, 100 12; M 0 12 C 30 6, 70 18, 100 12; M 0 12 C 30 18, 70 6, 100 12'
        }
    ];

    return (
        <div className="flex items-center justify-center w-24 h-6">
            <svg width="100" height="24" viewBox="0 0 100 24">
                {wavePaths.map((wave, index) => (
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex items-center justify-center"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="flex items-center justify-center"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Episode 1
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The Beginning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AudioWaveform isPlaying={isPlaying} />
          <button
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            title="Download Audios"
          >
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prompt = searchParams.get("prompt");

  const [steps, setSteps] = useState(
    workflowStepsData.map((s) => ({
      ...s,
      status: "pending",
      streamedContent: "",
      isExpanded: false,
      isVisible: false,
    }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlanning, setIsPlanning] = useState(true);
  const charIndexRef = useRef(0);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);

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
    }, 200); // Stagger delay

    return () => clearInterval(interval);
  }, [isPlanning]);

  // Effect to kick off the process for the current step, once it's visible
  useEffect(() => {
    if (isPlanning || !prompt || currentStepIndex >= steps.length) return;

    const currentStepData = steps[currentStepIndex];
    if (
      currentStepData &&
      currentStepData.isVisible &&
      currentStepData.status === "pending"
    ) {
      const timer = setTimeout(() => {
        setSteps((prev) =>
          prev.map((step, index) =>
            index === currentStepIndex
              ? { ...step, status: "in-progress", isExpanded: true }
              : step
          )
        );
      }, 300); // Small delay after becoming visible before starting
      return () => clearTimeout(timer);
    }
  }, [isPlanning, prompt, currentStepIndex, steps]);

  // Effect to handle the streaming animation
  const statusOfCurrentStep = steps[currentStepIndex]?.status;
  useEffect(() => {
    if (statusOfCurrentStep !== "in-progress") return;

    charIndexRef.current = 0;
    const contentToStream = workflowStepsData[currentStepIndex].content;

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
                ? { ...step, status: "completed", isExpanded: true }
                : step
            )
          );
          if (currentStepIndex === steps.length - 1) {
              setIsWorkflowComplete(true);
          }
        }, 300);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [statusOfCurrentStep, currentStepIndex]);

  // Effect to collapse all steps on final completion
  useEffect(() => {
    if (isWorkflowComplete) {
      const timer = setTimeout(() => {
        setSteps(prev => prev.map(s => ({...s, isExpanded: false})));
      }, 1000); // Wait a bit longer before collapsing all
      return () => clearTimeout(timer);
    }
  }, [isWorkflowComplete]);

  const handleToggleExpand = (indexToToggle: number) => {
    setSteps(prevSteps =>
      prevSteps.map((step, index) => {
        if (index === indexToToggle && step.status === "completed") {
          return { ...step, isExpanded: !step.isExpanded };
        }
        return step;
      })
    );
  };

  const handleRetry = (indexToRetry: number) => {
    setIsWorkflowComplete(false);
    setSteps(prev =>
      prev.map((step, i) => {
        if (i >= indexToRetry) {
          // Reset the retried step and all subsequent steps to pending
          return { 
            ...workflowStepsData[i], 
            status: 'pending', 
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
  };
  
  const handleContinue = (indexToContinueFrom: number) => {
    setSteps(prev =>
      prev.map((step, i) =>
        i === indexToContinueFrom ? { ...step, isExpanded: false } : step
      )
    );
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleImprove = (indexToImprove: number, feedback: string) => {
    console.log(`Feedback for step ${indexToImprove} ("${steps[indexToImprove].title}"): ${feedback}`);
    // Here you could add logic to re-run the step with the new feedback
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-[family-name:var(--font-geist-sans)]">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3 max-w-4xl flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900 dark:text-white">Warpspeed FM</p>
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex-shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Create New Story
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Prompt Section */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Your Storyline
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {prompt || "No prompt provided"}
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
                  onRetry={() => handleRetry(index)}
                  onContinue={() => handleContinue(index)}
                  onImprove={(feedback) => handleImprove(index, feedback)}
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
