import React from 'react';

interface SimpleMarkdownRendererProps {
  text: string;
}

export const SimpleMarkdownRenderer: React.FC<SimpleMarkdownRendererProps> = ({ text }) => {
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