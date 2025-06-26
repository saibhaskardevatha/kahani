import { getAudioURL } from "./utils";
// import { useCurrentUserId } from './clerkUser';

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

export interface MetadataResponse {
  title: string;
  description: string;
}

export interface ThumbnailResponse {
  imageBase64: string;
  textResponse?: string;
}

// ============================================================================
// FALLBACK IMAGES
// ============================================================================

// Simple flower SVG converted to base64
const FALLBACK_FLOWER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDAiIGZpbGw9IiNGRkMxMDciLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoOTApIi8+CjxwYXRoIGQ9Ik01MTIgMjcyYzAgMCAwIDAgMCAwdjQ4MGMwIDAgMCAwIDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDMTA3IiBzdHJva2Utd2lkdGg9IjgiIHRyYW5zZm9ybT0icm90YXRlKDEzNSkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwKSIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSgyMjUpIi8+CjxwYXRoIGQ9Ik01MTIgMjcyYzAgMCAwIDAgMCAwdjQ4MGMwIDAgMCAwIDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDMTA3IiBzdHJva2Utd2lkdGg9IjgiIHRyYW5zZm9ybT0icm90YXRlKDI3MCkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoMzE1KSIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSgzNjApIi8+CjxjaXJjbGUgY3g9IjQxMiIgY3k9IjQxMiIgcj0iMjAiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iNjEyIiBjeT0iNDEyIiByPSIyMCIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSI0MTIiIGN5PSI2MTIiIHI9IjIwIiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjYxMiIgY3k9IjYxMiIgcj0iMjAiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iMzEyIiBjeT0iNTEyIiByPSIyMCIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSI3MTIiIGN5PSI1MTIiIHI9IjIwIiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjM1MiIgY3k9IjM1MiIgcj0iMTUiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iNjcyIiBjeT0iMzUyIiByPSIxNSIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSIzNTIiIGN5PSI2NzIiIHI9IjE1IiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjY3MiIgY3k9IjY3MiIgcj0iMTUiIGZpbGw9IiNGRkMxMDciLz4KPC9zdmc+";

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = "https://api.playkahani.in/api/v1";

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
    options: RequestInit = {},
    timeout: number = 120000 // 2-minute default timeout
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Fetch user ID dynamically from Clerk
    const userId = 'user_2z0pZQuh1o19uBIYUvkTbxij20D'; 
    // To use dynamic userId from Clerk in React components/hooks:
// const userId = useCurrentUserId && typeof useCurrentUserId === 'function' ? useCurrentUserId() : null;
    let authHeader: Record<string, string> = {};
    if (userId) {
      authHeader = {
        Authorization: `Basic ${userId}`,
      };
    }
    // If userId is null, Authorization header will not be sent
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...options.headers,
      },
      signal: controller.signal,
    };

    const config = { ...defaultOptions, ...options };

    // Log outgoing headers for debugging
    if (typeof window !== 'undefined') {
      console.log('[APIClient] Outgoing headers:', config.headers);
    }

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
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new APIError(`Request timed out after ${timeout / 1000} seconds`, 408, endpoint);
      }
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        endpoint
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, data: unknown, timeout?: number): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      timeout
    );
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
export async function getAudio(language: string, script: ScriptLine[], persona: PersonaResponse): Promise<AudioResponse> {
  const fiveMinuteTimeout = 300000;
  const data = await apiClient.post<{ audio_path: string }>(
    "/voice",
    { language: language.toLowerCase(), script, persona },
    fiveMinuteTimeout
  );
  console.log(data);
  return {
    audio_url: getAudioURL(API_BASE_URL, data.audio_path),
  };
}

/**
 * Generates metadata (title and description) from storyline
 */
export async function getMetadata(storyline: string, language: string): Promise<MetadataResponse> {
  const response = await fetch('/api/generate-metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ storyline, language }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate metadata');
  }

  const data = await response.json();
  return {
    title: data.title,
    description: data.description,
  };
}

/**
 * Generates thumbnail image from storyline
 */
export async function getThumbnail(storyline: string, setting: string = '', style: string = ''): Promise<ThumbnailResponse> {
  const promptData = {
    plot_outline: storyline,
    setting: setting || 'General setting',
    style: style || 'Children\'s book illustration style'
  };

  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      prompt: JSON.stringify(promptData)
    }),
  });

  if (!response.ok) {
    return {
      imageBase64: FALLBACK_FLOWER_IMAGE,
      textResponse: 'Failed to generate thumbnail - showing fallback flower image',
    };
  }

  const data = await response.json();
  return {
    imageBase64: data.imageBase64,
    textResponse: data.textResponse,
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
    const audio = await getAudio(language, script.script, persona);
    
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