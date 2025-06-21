import { getAudioURL } from "./utils";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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

export interface AudioResponse {
  audio_url: string;
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = "https://kahani.thelamedev.site/api/v1";

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// ============================================================================
// API CLIENT
// ============================================================================

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new APIError(
          `API request failed: ${response.statusText}`,
          response.status,
          endpoint
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        endpoint
      );
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// ============================================================================
// API INSTANCE
// ============================================================================

const apiClient = new APIClient();

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches story outline based on user input
 */
export async function getStoryOutline(user_input: string): Promise<StoryOutlineResponse> {
  return apiClient.post<StoryOutlineResponse>("/storyline", { user_input });
}

/**
 * Fetches persona information based on story outline
 */
export async function getPersona(storylineOutput: StoryOutlineResponse): Promise<PersonaResponse> {
  return apiClient.post<PersonaResponse>("/persona", storylineOutput);
}

/**
 * Fetches script based on language, story outline, and persona
 */
export async function getScript(
  language: string,
  story_outline: StoryOutlineResponse,
  persona: PersonaResponse
): Promise<ScriptResponse> {
  return apiClient.post<ScriptResponse>("/script", {
    language,
    story_outline,
    persona,
  });
}

/**
 * Fetches audio based on script
 */
export async function getAudio(script: ScriptResponse): Promise<AudioResponse> {
  const data = await apiClient.post<{ audio_url: string }>("/audio", script);
  
  return {
    audio_url: getAudioURL(API_BASE_URL, data.audio_url),
  };
}

// ============================================================================
// WORKFLOW FUNCTIONS (HIGHER-LEVEL API)
// ============================================================================

/**
 * Complete workflow: Story outline → Persona → Script → Audio
 */
export async function generateCompleteStory(userInput: string, language: string) {
  try {
    // Step 1: Generate story outline
    const storyOutline = await getStoryOutline(userInput);
    
    // Step 2: Generate persona
    const persona = await getPersona(storyOutline);
    
    // Step 3: Generate script
    const script = await getScript(language, storyOutline, persona);
    
    // Step 4: Generate audio
    const audio = await getAudio(script);
    
    return {
      storyOutline,
      persona,
      script,
      audio,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Story generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Generate story outline and persona only
 */
export async function generateStoryWithPersona(userInput: string) {
  try {
    const storyOutline = await getStoryOutline(userInput);
    const persona = await getPersona(storyOutline);
    
    return {
      storyOutline,
      persona,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Story and persona generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}