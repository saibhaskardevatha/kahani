export const validatePrompt = (prompt: string): { isValid: boolean; error?: string } => {
  if (!prompt.trim()) {
    return { isValid: false, error: "Please enter a story idea" };
  }
  
  if (prompt.trim().length < 10) {
    return { isValid: false, error: "Story idea should be at least 10 characters long" };
  }
  
  if (prompt.trim().length > 1000) {
    return { isValid: false, error: "Story idea should be less than 1000 characters" };
  }
  
  return { isValid: true };
};

export const generateChatId = (): string => {
  return Math.random().toString(36).substring(7);
};

export const buildChatUrl = (
  id: string,
  prompt: string,
  language: string,
): string => {
  const params = new URLSearchParams({
    prompt: prompt.trim(),
    language,
  });
  
  return `/chat/${id}?${params.toString()}`;
};