import type { PostHog } from "posthog-js";

let posthog: PostHog | { capture: (...args: unknown[]) => void } = { capture: () => {} };

if (typeof window !== "undefined") {
  // Only import and initialize posthog-js on the client
  import("posthog-js").then((posthogJs) => {
    posthogJs.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: 'history_change',
      capture_pageleave: true, // Enable pageleave capture
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
      debug: process.env.NODE_ENV === "development",
    });
    posthog = posthogJs.default;
  });
}

export default posthog;