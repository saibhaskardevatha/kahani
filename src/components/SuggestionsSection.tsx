import React from 'react';
import { Suggestion } from '../types';

interface SuggestionsSectionProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        Try these story lines:
      </h3>
      <div className="grid grid-cols-1 gap-3" role="list">
        {suggestions.slice(0, 3).map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="text-left p-3 rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm font-[family-name:var(--font-geist-sans)] cursor-pointer"
            role="listitem"
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
}; 