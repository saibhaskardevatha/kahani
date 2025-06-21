export interface Language {
  name: string;
  icon: string;
  flag: string;
}


export interface Duration {
  name: string; // Display label, e.g. "Short (5 min)"
  value: string; // Internal value, e.g. "short"
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface Tip {
  id: string;
  text: string;
}

export type HomePageProps = Record<string, never>; 