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
    id: "krishna-flute",
    text: "A young musician discovers an ancient flute that belonged to Lord Krishna, and when played, it opens a portal to Vrindavan where they must help restore harmony between humans and nature"
  },
  {
    id: "magical-school",
    text: "A shy 10-year-old girl finds a magical book that transports her to a school where animals can talk and teaches her the power of friendship and courage through exciting adventures"
  },
  {
    id: "corporate-ghost",
    text: "A stressed corporate executive moves into an old Mumbai apartment only to discover it's haunted by the ghost of a 1940s freedom fighter who helps them find meaning beyond their 9-to-5 life"
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
  }
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