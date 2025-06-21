import React, { useState, useRef } from "react";
import { Duration } from "../types";
import { ChevronDownIcon, CheckIcon } from "./icons";
import { useClickOutside } from "../hooks/useClickOutside";

interface DurationDropdownProps {
  durations: Duration[];
  selectedDuration: string;
  onDurationSelect: (duration: string) => void;
}

export const DurationDropdown: React.FC<DurationDropdownProps> = ({
  durations,
  selectedDuration,
  onDurationSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDurationData = durations.find((d) => d.value === selectedDuration);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleDurationSelect = (duration: string) => {
    onDurationSelect(duration);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border-2 border-slate-200 bg-background text-foreground h-10 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black-500/50 cursor-pointer hover:border-slate-300 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected duration: ${selectedDurationData?.name}`}
      >
        <span>{selectedDurationData?.name}</span>
        <ChevronDownIcon
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-60 bg-white border border-slate-200 rounded-md shadow-lg z-10 overflow-hidden"
          role="listbox"
          aria-label="Duration options"
        >
          {durations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => handleDurationSelect(duration.value)}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                selectedDuration === duration.value
                  ? "bg-slate-100 text-black"
                  : "text-slate-700"
              }`}
              role="option"
              aria-selected={selectedDuration === duration.value}
            >
              <span className="text-sm font-medium">{duration.name}</span>
              {selectedDuration === duration.value && (
                <CheckIcon className="ml-auto text-green-500" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
