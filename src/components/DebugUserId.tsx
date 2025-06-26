"use client";

import { useAuth } from "@clerk/nextjs";

export default function DebugUserId() {
  const { userId, isSignedIn } = useAuth();

  return (
    <div style={{ padding: 16, background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 8, margin: 16 }}>
      <h3>User ID Debug Info</h3>
      <div>
        <strong>Signed In:</strong> {isSignedIn ? "Yes" : "No"}
      </div>
      <div>
        <strong>User ID:</strong> {userId || <span style={{ color: 'red' }}>No user ID found</span>}
      </div>
    </div>
  );
}
