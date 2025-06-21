// import { getAudioURL } from "./utils";

// Kahani API utility for backend endpoints
export interface StoryOutlineResponse {
  plot_outline: string;
  characters: string[];
  mood: string;
  tone: string;
  setting: string;
  conflict: string;
  resolution: string;
  style: string;
}

export interface PersonaCharacter {
  name: string;
  age: string;
  gender: string;
  background: string;
  personality_traits: string;
}

export interface PersonaResponse {
  [key: string]: PersonaCharacter;
}

export async function getPersona(storylineOutput: StoryOutlineResponse): Promise<PersonaResponse> {
  const res = await fetch("https://kahani.thelamedev.site/api/v1/persona", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(storylineOutput),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch persona");
  }
  return res.json();
}

export interface ScriptRequest {
  language: string;
  story_outline: StoryOutlineResponse;
  persona: PersonaResponse;
}

export interface ScriptLine {
  speaker: string;
  text: string;
  voice_config: {
    voice_model: string;
    pitch: string;
    pace: string;
    loudness: string;
  };
}

export interface ScriptResponse {
  script: ScriptLine[];
}

export async function getScript(language: string, story_outline: StoryOutlineResponse, persona: PersonaResponse): Promise<ScriptResponse> {
  const res = await fetch("https://kahani.thelamedev.site/api/v1/script", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language, story_outline, persona }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch script");
  }
  return res.json();
}

// getAudioURL("https://kahani.thelamedev.site/api/v1", "/public/laksdlakjsd.wav")

export async function getStoryOutline(user_input: string): Promise<StoryOutlineResponse> {
  const res = await fetch("https://kahani.thelamedev.site/api/v1/storyline", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_input }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch story outline");
  }
  return res.json();
}
