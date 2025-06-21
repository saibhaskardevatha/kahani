import React, { useState } from 'react';
import { FeedbackFormProps } from '../../types/chat';

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback);
      setFeedback('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="What would you like to improve?"
        className="w-full p-2 rounded-md bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        rows={3}
        aria-label="Feedback input"
      />
      <button 
        onClick={handleSubmit}
        className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        disabled={!feedback.trim()}
        aria-label="Submit feedback"
      >
        Submit Feedback
      </button>
    </div>
  );
}; 