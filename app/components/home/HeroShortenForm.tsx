"use client";

import Image from "next/image";
import { FormEvent, KeyboardEvent, MouseEvent, PointerEvent, useMemo, useState } from "react";
import posthog from "posthog-js";

type ShortenApiSuccess = {
  shortUrl: string;
  code: string;
};

type ShortenApiError = {
  error: string;
};

function normalizeUrl(rawValue: string) {
  let value = rawValue.trim();
  if (!value) {
    return { normalized: "", error: "Please enter a URL." };
  }

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value)) {
    value = `https://${value}`;
  }

  try {
    const parsedUrl = new URL(value);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return { normalized: "", error: "Only http and https URLs are supported." };
    }
    return { normalized: parsedUrl.toString(), error: "" };
  } catch {
    return { normalized: "", error: "Enter a valid absolute URL." };
  }
}

export function HeroShortenForm() {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFromPreview, setCopiedFromPreview] = useState(false);

  const canSubmit = useMemo(() => inputValue.trim().length > 0 && !isPending, [inputValue, isPending]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setShortUrl("");
    setCopied(false);

    const { normalized, error } = normalizeUrl(inputValue);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setIsPending(true);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized, source: "homepage_hero" }),
      });

      const data = (await response.json()) as ShortenApiSuccess | ShortenApiError;

      if (!response.ok) {
        const errorCode = "error" in data ? data.error : "unexpected_error";
        if (errorCode === "invalid_url") {
          setErrorMessage("That URL is invalid. Please use a full and valid URL.");
        } else {
          setErrorMessage("Something went wrong while shortening your link.");
        }
        return;
      }

      if (!("shortUrl" in data)) {
        setErrorMessage("Unexpected API response.");
        return;
      }

      setShortUrl(data.shortUrl);
      setInputValue(normalized);
      posthog.capture("link_shortened", {
        short_url: data.shortUrl,
        short_code: data.code,
        source: "homepage_hero",
      });
    } catch (err) {
      posthog.captureException(err);
      setErrorMessage("Network issue. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function copyShortUrl() {
    if (!shortUrl) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shortUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      return true;
    } catch {
      setErrorMessage("Unable to copy. Please copy the link manually.");
      return false;
    }
  }

  function showCopiedFeedback(fromPreview: boolean) {
    if (fromPreview) {
      setCopiedFromPreview(true);
      window.setTimeout(() => setCopiedFromPreview(false), 2000);
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopy() {
    const didCopy = await copyShortUrl();
    if (didCopy) {
      posthog.capture("hero_short_url_copied", { short_url: shortUrl, source: "homepage_hero" });
      showCopiedFeedback(false);
    }
  }

  function isTouchInteraction(event: PointerEvent | MouseEvent) {
    if ("pointerType" in event && event.pointerType) {
      return event.pointerType === "touch";
    }
    return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  }

  async function handlePreviewCopy(fromTouchTap: boolean) {
    const didCopy = await copyShortUrl();
    if (didCopy) {
      showCopiedFeedback(true);
      if (!fromTouchTap) {
        setCopied(false);
      }
    }
  }

  async function onPreviewClick(event: MouseEvent<HTMLButtonElement>) {
    if (!shortUrl) return;
    if (isTouchInteraction(event)) {
      await handlePreviewCopy(true);
    }
  }

  async function onPreviewDoubleClick() {
    if (!shortUrl) return;
    await handlePreviewCopy(false);
  }

  async function onPreviewPointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!shortUrl) return;
    if (event.pointerType === "touch") {
      await handlePreviewCopy(true);
    }
  }

  async function onPreviewKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!shortUrl) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      await handlePreviewCopy(false);
    }
  }

  function getPreviewHint() {
    if (copiedFromPreview) return "Copied";
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return "Tap to copy";
    }
    return "Double-click to copy";
  }

  return (
    <div className="relative mt-2">
      <Image
        src="/big-arrow.svg"
        alt=""
        aria-hidden="true"
        width={120}
        height={120}
        className="pointer-events-none absolute -left-24 top-11 hidden h-24 w-24 md:block [filter:drop-shadow(2px_2px_0_#111)]"
      />

      <form
        className="rounded-none border-[8px] border-[var(--stroke)] bg-white p-4 shadow-[8px_8px_0_0_#111] sm:p-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          <label className="sr-only" htmlFor="long-url">
            Long URL
          </label>
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-black px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
              CD
            </span>
            <input
              id="long-url"
              name="long-url"
              type="text"
              autoComplete="url"
              placeholder="Paste long URL here"
              className="h-20 w-full border-4 border-[var(--stroke)] bg-[#f4f4f2] pl-20 pr-4 text-[clamp(1.15rem,2.4vw,2rem)] font-bold leading-none text-[var(--ink-1)] outline-none placeholder:text-black/30"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              aria-invalid={errorMessage ? "true" : "false"}
              aria-describedby="hero-form-message"
            />
          </div>
          <button
            type="submit"
            className="focus-ring h-20 shrink-0 border-4 border-[var(--stroke)] bg-[#84f976] px-6 text-center text-base font-black uppercase tracking-[0.1em] text-black shadow-[4px_4px_0_0_#111] lg:min-w-[300px]"
            disabled={!canSubmit}
          >
            {isPending ? "Shortening..." : "Shorten Link Now"}
          </button>
        </div>

        <div id="hero-form-message" className="mt-4 min-h-6 text-sm" role="status" aria-live="polite">
          {errorMessage ? (
            <p className="font-medium text-red-700">{errorMessage}</p>
          ) : shortUrl ? (
            <div className="flex flex-wrap items-center gap-2 font-bold text-[#006e0d]">
              <span>Your short link:</span>
              <a className="focus-ring break-all underline underline-offset-2" href={shortUrl}>
                {shortUrl}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="focus-ring brutal-btn brutal-btn-secondary brutal-btn-sm shrink-0"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          ) : (
            <p className="font-medium text-[var(--text-muted)]">No signup needed to try it.</p>
          )}
        </div>
      </form>

      <div className="relative mx-auto mt-6 max-w-[640px]">
        <Image
          src="/arrow/arriw-right.svg"
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          className="pointer-events-none absolute -top-[2.4rem] left-10 hidden h-14 w-14 opacity-90 md:block"
        />
        <Image
          src="/arrow/arrow-left.svg"
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          className="pointer-events-none absolute -top-[2.4rem] right-10 hidden h-14 w-14 opacity-90 md:block"
        />
        <Image
          src="/star.svg"
          alt=""
          aria-hidden="true"
          width={92}
          height={92}
          className="pointer-events-none absolute -left-[4.5rem] top-8 hidden h-20 w-20 rotate-[-20deg] opacity-90 md:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-2 hidden h-28 w-28 border-4 border-black/8 bg-[radial-gradient(circle,_rgba(17,17,17,0.15)_1.2px,_transparent_1.2px)] bg-[length:10px_10px] md:block"
        />

        <div className="mx-auto w-fit border-4 border-b-0 border-[var(--stroke)] bg-black px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white">
          Live preview
        </div>
        <div className="border-4 border-[var(--stroke)] bg-white p-4 shadow-[4px_4px_0_0_#111] sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-black/60">
                Before
              </p>
              <p className="truncate text-base font-bold text-black/50 sm:text-lg">
                {inputValue.trim() || "https://verylongurl.com/analytics/dashboard?campaign=summer"}
              </p>
            </div>
            <div className="hidden text-lg font-bold text-black/50 md:block">→</div>
            <div className="min-w-0 md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#006e0d]/70">
                After
              </p>
              {shortUrl ? (
                <div className="flex min-w-0 flex-col gap-1 md:items-end">
                  <button
                    type="button"
                    className="focus-ring max-w-full cursor-pointer truncate text-left text-lg font-black text-[#006e0d] underline decoration-[#006e0d]/40 underline-offset-2 hover:decoration-[#006e0d] sm:text-xl md:text-right"
                    onClick={onPreviewClick}
                    onDoubleClick={onPreviewDoubleClick}
                    onPointerUp={onPreviewPointerUp}
                    onKeyDown={onPreviewKeyDown}
                    aria-label="Copy generated short link from live preview"
                    title="Double-click to copy"
                  >
                    {shortUrl}
                  </button>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#006e0d]/70">
                    {getPreviewHint()}
                  </p>
                </div>
              ) : (
                <p className="truncate text-lg font-black text-[#006e0d] sm:text-xl">urlsy.cc/short</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
