import { Language, Suggestion, Tip, Duration } from '../types';

export const LANGUAGES: Language[] = [
  {
    name: "Hindi",
    icon: "हिं",
    flag: "हिंदी",
  },
  {
    name: "Marathi",
    icon: "म",
    flag: "मराठी",
  },
  {
    name: "Telugu",
    icon: "తె",
    flag: "తెలుగు",
  },
  {
    name: "Punjabi",
    icon: "ਪ",
    flag: "ਪੰਜਾਬੀ",
  },
];

export const DURATIONS: Duration[] = [
  { name: "Short (5 min)", value: "short" },
  { name: "Medium (10 min)", value: "medium" },
  { name: "Long (15+ min)", value: "long" },
];

export const DEFAULT_DURATION = "short";

// Language variations for animated "Ka" character
export const KA_VARIATIONS = [
  "Ka", // English
  "क",  // Hindi/Devanagari
  "క",  // Telugu
  "ਕ",  // Punjabi/Gurmukhi
  "க",  // Tamil
] as const;

export const SUGGESTIONS: Suggestion[] = [
  {
    id: "time-traveler",
    text: "A time traveler wakes up in 1920s Paris with no memory, only to discover they're being hunted by a mysterious organization that knows their future"
  },
  {
    id: "dream-recorder",
    text: "In a world where dreams are recorded and sold as entertainment, a woman discovers her recurring nightmare is actually a suppressed memory of a crime she witnessed"
  },
  {
    id: "radio-dj",
    text: "A small-town radio DJ receives a call from someone claiming to be from 50 years in the future, warning about an event that will happen in exactly 24 hours"
  },
];

export const TIPS: Tip[] = [
  {
    id: "concise",
    text: "Keep your storyline concise but descriptive"
  },
  {
    id: "characters",
    text: "Include key characters and their motivations"
  },
  {
    id: "setting",
    text: "Mention the setting and atmosphere you want"
  },
  {
    id: "tone",
    text: "Specify the tone (dramatic, comedic, mysterious, etc.)"
  },
  {
    id: "audio",
    text: "Add any specific audio elements you'd like to hear"
  },
];

export const DEFAULT_LANGUAGE = "Hindi";

export const APP_CONFIG = {
  title: "Kahani",
  description: "Share your story idea and we'll transform it into an immersive audio experience",
  placeholder: "What is your story line?",
  createButtonText: "Create",
  suggestionsTitle: "Try these story lines:",
  tipsTitle: "Writing Tips",
} as const; 