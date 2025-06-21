import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { ChevronDownIcon, CheckIcon } from './icons';
import { useClickOutside } from '../hooks/useClickOutside';

interface LanguageDropdownProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  languages,
  selectedLanguage,
  onLanguageSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguageData = languages.find(
    (lang) => lang.name === selectedLanguage
  );

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageSelect = (language: string) => {
    onLanguageSelect(language);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border-2 border-slate-200 dark:border-slate-700/50 bg-background text-foreground h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black-500/50 dark:focus:ring-black-400/50 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected language: ${selectedLanguageData?.name}`}
      >
        <span className="text-lg" aria-hidden="true">
          {selectedLanguageData?.icon}
        </span>
        <span>{selectedLanguageData?.name}</span>
        <ChevronDownIcon
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 overflow-hidden"
          role="listbox"
          aria-label="Language options"
        >
          {languages.map((language) => (
            <button
              key={language.name}
              onClick={() => handleLanguageSelect(language.name)}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                selectedLanguage === language.name
                  ? "bg-slate-100 dark:bg-slate-700 text-black dark:text-white"
                  : "text-slate-700 dark:text-slate-300"
              }`}
              role="option"
              aria-selected={selectedLanguage === language.name}
            >
              <span className="text-lg" aria-hidden="true">
                {language.icon}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{language.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {language.flag}
                </span>
              </div>
              {selectedLanguage === language.name && (
                <CheckIcon className="ml-auto text-green-500" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 