import { useAuth } from '@clerk/nextjs';

export function useCurrentUserId(): string | null {
  // This hook must be used inside a React component or another hook, never outside.
  const { userId } = useAuth();
  return userId || null;
}
