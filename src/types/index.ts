export interface Language {
  name: string;
  icon: string;
  flag: string;
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