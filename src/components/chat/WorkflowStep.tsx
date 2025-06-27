import React, { useState } from 'react';
import { RotateCcw, ArrowUpDown, ChevronsRight, Pause } from "lucide-react";
import { WorkflowStepProps } from '../../types/chat';
import { SimpleMarkdownRenderer } from './SimpleMarkdownRenderer';
import { FeedbackForm } from './FeedbackForm';

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
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
  onImproveClick,
  autoContinueTimer,
  onStopTimer,
  stepIndex,
}) => {
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";
  const showContent = isInProgress || isExpanded;
  const canToggle = isCompleted;
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const handleImproveSubmit = (feedback: string) => {
    onImprove(feedback);
    setIsFeedbackVisible(false);
    onRetry();
  };

  const handleToggleFeedback = () => {
    onImproveClick(); // Stop the auto-continue timer when Improve button is clicked
    setIsFeedbackVisible(!isFeedbackVisible);
  };

  // Check if this step should show the timer (only for the active step that has timer running)
  const isActiveStep = autoContinueTimer?.activeStepIndex === stepIndex;
  const shouldShowTimer = isCompleted && !isLast && autoContinueTimer?.isRunning && isActiveStep;
  const shouldShowContinueButton = isCompleted && !isLast && !shouldShowTimer;

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
              : "bg-slate-300"
          }`}
          aria-hidden="true"
        />
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 mt-2" aria-hidden="true" />
        )}
      </div>

      {/* Right side: Title and Content */}
      <div className="flex-1 pb-4">
        <div
          className={`flex items-center justify-between ${
            canToggle ? "cursor-pointer group" : ""
          }`}
          onClick={canToggle ? onToggleExpand : undefined}
          role={canToggle ? "button" : undefined}
          tabIndex={canToggle ? 0 : undefined}
          onKeyDown={canToggle ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpand();
            }
          } : undefined}
        >
          <p
            className={`text-sm font-medium ${
              isCompleted || isInProgress
                ? "text-slate-800"
                : "text-slate-500"
            }`}
          >
            {title}
          </p>
          {canToggle && (
            <svg
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
          style={{ gridTemplateRows: showContent && content ? "auto" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="mt-2 text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
              <SimpleMarkdownRenderer text={content} />
              {isInProgress && (
                <span 
                  className="inline-block w-1.5 h-4 bg-slate-700 animate-pulse ml-1 align-middle"
                  aria-hidden="true"
                />
              )}
            </div>
            {isCompleted && (
              <div className="mt-4 border-t border-slate-200 pt-3 flex items-center gap-2 animate-in slide-in-from-top-2 duration-500 ease-out">
                <button 
                  onClick={onRetry} 
                  title="Retry" 
                  className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-yellow-600 font-semibold px-2 py-1 rounded-md hover:bg-yellow-50 transition-all duration-200 transform"
                  aria-label="Retry this step"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retry
                </button>
                <button 
                  onClick={handleToggleFeedback} 
                  title="Improve" 
                  className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-semibold px-2 py-1 rounded-md hover:bg-blue-50 transition-all duration-200 transform"
                  aria-label="Improve this step" 
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Improve
                </button>
                
                {/* Timer display - replaces Continue button when auto-continue is running for this step */}
                {shouldShowTimer && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                    <span>Continuing in {autoContinueTimer.timeLeft}s</span>
                    <button 
                      onClick={onStopTimer}
                      title="Stop auto-continue" 
                      className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-700 font-semibold px-2 py-1 rounded-md hover:bg-orange-50 transition-all duration-200 transform"
                      aria-label="Stop auto-continue timer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Stop
                    </button>
                  </div>
                )}
                
                {/* Original Continue button - shows when timer is not running for this step */}
                {shouldShowContinueButton && (
                  <button 
                    onClick={onContinue} 
                    title="Continue to Next Step" 
                    className="cursor-pointer flex items-center gap-1.5 text-xs text-slate-500 hover:text-green-600 font-semibold px-2 py-1 rounded-md hover:bg-green-50 transition-all duration-200 transform"
                    aria-label="Continue to next step"
                  >
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