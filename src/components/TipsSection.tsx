import React from 'react';
import { Tip } from '../types';

interface TipsSectionProps {
  tips: Tip[];
  isVisible: boolean;
}

export const TipsSection: React.FC<TipsSectionProps> = ({ tips, isVisible }) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <h4 className="font-medium text-sm mb-3 text-foreground">
          Writing Tips
        </h4>
        <ul className="space-y-2" role="list">
          {tips.map((tip) => (
            <li
              key={tip.id}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="text-xs mt-1 text-primary" aria-hidden="true">
                •
              </span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 