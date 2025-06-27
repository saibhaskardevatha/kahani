import { getAudioURL } from "./utils";
// import { useCurrentUserId } from './clerkUser';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StoryOutlineResponse {
  story_id: string;
  plot_outline: string;
  characters: { name: string; description: string }[];
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
export const FALLBACK_FLOWER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjUxMiIgY3k9IjUxMiIgcj0iNDAiIGZpbGw9IiNGRkMxMDciLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoOTApIi8+CjxwYXRoIGQ9Ik01MTIgMjcyYzAgMCAwIDAgMCAwdjQ4MGMwIDAgMCAwIDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDMTA3IiBzdHJva2Utd2lkdGg9IjgiIHRyYW5zZm9ybT0icm90YXRlKDEzNSkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwKSIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSgyMjUpIi8+CjxwYXRoIGQ9Ik01MTIgMjcyYzAgMCAwIDAgMCAwdjQ4MGMwIDAgMCAwIDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZDMTA3IiBzdHJva2Utd2lkdGg9IjgiIHRyYW5zZm9ybT0icm90YXRlKDI3MCkiLz4KPHBhdGggZD0iTTUxMiAyNzJjMCAwIDAgMCAwIDB2NDgwYzAgMCAwIDAgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkMxMDciIHN0cm9rZS13aWR0aD0iOCIgdHJhbnNmb3JtPSJyb3RhdGUoMzE1KSIvPgo8cGF0aCBkPSJNNTEyIDI3MmMwIDAgMCAwIDAgMHY0ODBjMCAwIDAgMCAwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGQzEwNyIgc3Ryb2tlLXdpZHRoPSI4IiB0cmFuc2Zvcm09InJvdGF0ZSgzNjApIi8+CjxjaXJjbGUgY3g9IjQxMiIgY3k9IjQxMiIgcj0iMjAiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iNjEyIiBjeT0iNDEyIiByPSIyMCIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSI0MTIiIGN5PSI2MTIiIHI9IjIwIiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjYxMiIgY3k9IjYxMiIgcj0iMjAiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iMzEyIiBjeT0iNTEyIiByPSIyMCIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSI3MTIiIGN5PSI1MTIiIHI9IjIwIiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjM1MiIgY3k9IjM1MiIgcj0iMTUiIGZpbGw9IiNGRkMxMDciLz4KPGNpcmNsZSBjeD0iNjcyIiBjeT0iMzUyIiByPSIxNSIgZmlsbD0iI0ZGQzEwNyIvPgo8Y2lyY2xlIGN4PSIzNTIiIGN5PSI2NzIiIHI9IjE1IiBmaWxsPSIjRkZDMTA3Ii8+CjxjaXJjbGUgY3g9IjY3MiIgY3k9IjY3MiIgcj0iMTUiIGZpbGw9IiNGRkMxMDciLz4KPC9zdmc+";

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

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = 120000 // 2-minute default timeout
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Fetch user ID dynamically from Clerk
    const userId = 'user_2z3bndY6Unq36m7K1qgLrDbnuAW'; 
    // const userId = getCurrentUserId && typeof getCurrentUserId === 'function' ? getCurrentUserId() : null;
    let authHeader: Record<string, string> = {};
    if (userId) {
      authHeader = {
        Authorization: `Bearer ${btoa(userId)}`,
      };
    }
    // If userId is null, Authorization header will not be sent
    const method = (options.method || 'GET').toUpperCase();
    const computedHeaders: Record<string, string> = {
      ...authHeader,
      ...(options.headers as Record<string, string> | undefined),
    };
    if (!(method === 'GET' || method === 'HEAD')) {
      computedHeaders['Content-Type'] = 'application/json';
    }

    const defaultOptions: RequestInit = {
      headers: computedHeaders,
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

  async get<T>(endpoint: string, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, timeout);
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


// Fetches story outline based on user input
export async function getStoryOutline(user_input: string, language: string = "hindi"): Promise<StoryOutlineResponse> {
  type ApiResp = { story_id: string; storyline: Omit<StoryOutlineResponse, 'story_id'> };
  const data = await apiClient.post<ApiResp>("/storyline", { user_input, language: language.toLowerCase() });
  return { story_id: data.story_id, ...data.storyline } as StoryOutlineResponse;
}

// Fetches persona information based on story outline
export async function getPersona(storylineOutput: StoryOutlineResponse): Promise<PersonaResponse> {
  const { story_id } = storylineOutput;
  const data = await apiClient.get<{ persona: PersonaResponse }>(`/persona/${story_id}`);
  return data.persona;
}

// Fetches script based on language, story outline, and persona
export async function getScript(story_outline: StoryOutlineResponse): Promise<ScriptResponse & { story_id: string }> {
  const { story_id } = story_outline;
  return apiClient.get<ScriptResponse & { story_id: string }>(`/script/${story_id}`);
}

// Fetches audio based on script
export async function getAudio(story_id: string): Promise<AudioResponse> {
  const fiveMinuteTimeout = 300000;
  const maxAttempts = 10;
  const retryDelayMs = 300000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const data = await apiClient.get<{ audio_path: string }>(`/voice/${story_id}`, fiveMinuteTimeout);
      if (data?.audio_path) {
        return {
          audio_url: getAudioURL(API_BASE_URL, data.audio_path),
        };
      }
      // If audio_path is missing, fall through to retry
    } catch (err) {
      // If final attempt or error is 4xx, rethrow
      if (attempt === maxAttempts) {
        throw err;
      }
      // Otherwise ignore and retry after delay
    }
    await new Promise((res) => setTimeout(res, retryDelayMs * attempt));
  }
  throw new APIError('Audio not ready after multiple attempts', 500, `/voice/${story_id}`);
}

// Generates metadata (title and description) from storyline
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

// Generates thumbnail image from storyline
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

// Complete workflow: Story outline → Persona → Script → Audio
export async function generateCompleteStory(userInput: string, _language: string) {
  try {
    // Step 1: Generate story outline
    const storyOutline = await getStoryOutline(userInput);

    // Step 2: Generate persona
    const persona = await getPersona(storyOutline);

    // Step 3: Generate script
    const script = await getScript(storyOutline);

    // Step 4: Generate audio
    const audio = await getAudio(storyOutline.story_id);

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

// Generate story outline and persona only
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
