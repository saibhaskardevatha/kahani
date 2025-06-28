import { useAuth } from '@clerk/nextjs';

export function useCurrentUserId(): string | null {
  // This hook must be used inside a React component or another hook, never outside.
  const { userId } = useAuth();
  return userId || null;
}

/**
 * Safe utility to fetch the current user's ID outside of React components/hooks.
 * Falls back to null if Clerk has not finished loading or user is not signed in.
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;

  // Narrow the `window` type to include Clerk when available without using `any`.
  interface ClerkGlobal {
    Clerk?: {
      user?: {
        id: string;
      };
    };
  }

  const globalObj = window as unknown as ClerkGlobal;
  return globalObj.Clerk?.user?.id ?? null;
}
