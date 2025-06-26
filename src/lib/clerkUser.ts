import { useAuth } from '@clerk/nextjs';

export function getCurrentUserId(): string | null {
  // This must be called inside a React component or hook
  try {
    // useAuth() must be called within a ClerkProvider context
    const { userId } = useAuth();
    return userId || null;
  } catch {
    return null;
  }
}
