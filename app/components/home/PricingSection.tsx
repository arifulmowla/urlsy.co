"use client";

import posthog from "posthog-js";
import { Kicker } from "@/app/components/marketing/BrutalPrimitives";
import Link from "next/link";

const pricingPlans = [
  {
    tier: "Entry",
    name: "Free",
    price: "$0",
    period: "/mo",
    cta: "Select plan",
    href: "/login",
    features: ["50 links / month", "Basic analytics", "Standard redirects"],
  },
  {
    tier: "Advanced",
    name: "Pro",
    price: "$5",
    period: "/mo",
    cta: "Go Pro now",
    href: "/dashboard/billing",
    features: [
      "Unlimited links",
      "Pro analytics suite",
      "Custom domains",
      "API access",
    ],
    highlighted: true,
  },
  {
    tier: "Scaled",
    name: "Corp",
    price: "$99",
    period: "/mo",
    cta: "Contact sales",
    href: "/contact",
    features: ["High-throughput API", "Dedicated support", "SSO & IAM"],
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-y-4 border-[var(--stroke)] bg-transparent px-0 py-12 sm:py-14"
      aria-labelledby="pricing-title"
    >
      <div className="text-center">
        <Kicker className="text-[0.62rem] tracking-[0.28em] text-black/70">Investment</Kicker>
        <h2
          id="pricing-title"
          className="mt-2 text-4xl font-black uppercase tracking-[-0.045em] text-black sm:text-5xl"
        >
          The plans
        </h2>
        <div className="mx-auto mt-2 h-[8px] w-[190px] bg-[var(--bg-hero)]" />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={`relative border-4 border-[var(--stroke)] p-6 shadow-[4px_4px_0_0_#111] ${
              plan.highlighted
                ? "bg-[var(--bg-hero)] text-black"
                : plan.name === "Corp"
                  ? "bg-black text-white"
                  : "bg-[#f4f4f2] text-black"
            }`}
          >
            {plan.highlighted ? (
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 border-2 border-[var(--stroke)] bg-black px-5 py-1 text-[0.64rem] font-black uppercase tracking-[0.18em] text-[var(--bg-hero)]">
                Most popular
              </div>
            ) : null}

            <p
              className={`text-[0.68rem] font-bold uppercase tracking-[0.2em] ${
                plan.name === "Corp" ? "text-white/60" : "text-[var(--ink-2)]"
              }`}
            >
              {plan.tier}
            </p>
            <h3 className="mt-2 text-[2.7rem] font-black uppercase leading-none tracking-[-0.04em]">
              {plan.name}
            </h3>
            <p className="mt-1 text-[3rem] font-black leading-none tracking-[-0.05em]">
              {plan.price}
              <span
                className={`ml-1 text-[1.5rem] font-bold ${
                  plan.name === "Corp" ? "text-white/70" : "text-[var(--ink-2)]"
                }`}
              >
                {plan.period}
              </span>
            </p>

            <ul
              className={`mt-6 space-y-3 text-sm font-semibold uppercase tracking-[0.02em] ${
                plan.name === "Corp" ? "text-white/88" : "text-black/90"
              }`}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className={`text-[1rem] font-black ${plan.name === "Corp" ? "text-[var(--bg-hero)]" : "text-[#0a8d18]"}`}>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              onClick={() =>
                posthog.capture("pricing_cta_clicked", {
                  plan: plan.name,
                  tier: plan.tier,
                  price: plan.price,
                  cta: plan.cta,
                })
              }
              className={`focus-ring mt-8 inline-flex h-14 w-full items-center justify-center border-4 border-[var(--stroke)] px-4 text-sm font-black uppercase tracking-[0.12em] ${
                plan.highlighted
                  ? "bg-black text-white"
                  : plan.name === "Corp"
                    ? "bg-[var(--bg-hero)] text-black"
                    : "bg-transparent text-[var(--ink-1)]"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
