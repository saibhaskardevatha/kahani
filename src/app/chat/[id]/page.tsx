"use client";

import { useSearchParams } from "next/navigation";
import { ChatHeader } from "../../../components/chat/ChatHeader";
import { WorkflowStep } from "../../../components/chat/WorkflowStep";
import { AudioPlayer } from "../../../components/chat/AudioPlayer";
import { useWorkflow } from "../../../hooks/useWorkflow";
import { WorkflowStep as WorkflowStepType } from "../../../types/chat";
import { DEFAULT_LANGUAGE } from "../../../constants";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const language = searchParams.get("language") || DEFAULT_LANGUAGE;

  const {
    steps,
    isPlanning,
    isWorkflowComplete,
    handleToggleExpand,
    handleRetry,
    handleContinue,
    handleImprove,
  } = useWorkflow(prompt);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 font-[family-name:var(--font-geist-sans)]">
      <ChatHeader language={language} />

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
              <div 
                className="w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"
                aria-hidden="true"
              />
              <span>Planning...</span>
            </div>
          ) : (
            <div className="relative">
              {steps.map((step: WorkflowStepType, index: number) => (
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
                  onImprove={(feedback: string) => handleImprove(index, feedback)}
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
