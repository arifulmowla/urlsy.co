"use client";

import posthog from "posthog-js";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

type PostHogProviderProps = {
  children: ReactNode;
};

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || initializedRef.current) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      autocapture: true,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });

    initializedRef.current = true;
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || !initializedRef.current || !pathname) return;

    const query = window.location.search;
    const currentUrl = query ? `${pathname}?${query}` : pathname;
    if (lastUrlRef.current === currentUrl) return;

    posthog.capture("$pageview", {
      $current_url: `${window.location.origin}${currentUrl}`,
    });
    lastUrlRef.current = currentUrl;
  }, [pathname]);

  return <>{children}</>;
}
