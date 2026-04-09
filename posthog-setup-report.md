<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into urlsy.cc. The project already had a strong foundation (posthog-js, posthog-node, PostHogProvider, user identification, and server-side event tracking). The following improvements and additions were made in this session:

1. **Environment variables**: Set `NEXT_PUBLIC_POSTHOG_KEY` (was missing) and confirmed `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com` in `.env.local`.

2. **Migrated to `instrumentation-client.ts`**: For Next.js 15.3+, PostHog initialization now lives in `instrumentation-client.ts` using the `/ingest` reverse proxy (already configured in `next.config.ts`), with `capture_exceptions: true` for automatic error tracking and `defaults: '2026-01-30'` opt-in.

3. **Slimmed down `PostHogProvider.tsx`**: Removed the `posthog.init()` call (now in `instrumentation-client.ts`). The component now only handles manual `$pageview` capture on App Router navigation changes.

4. **Added `pricing_cta_clicked` event** in `PricingSection.tsx`: Converted to a client component to fire this event when a visitor clicks a pricing plan CTA, with `plan`, `tier`, `price`, and `cta` properties.

5. **Added `hero_short_url_copied` event** in `HeroShortenForm.tsx`: Fires when a user copies their shortened URL result from the homepage hero form.

## Event table

| Event | Description | File |
|---|---|---|
| `$pageview` | Fired on every client-side page navigation | `app/components/analytics/PostHogProvider.tsx` |
| `user_signed_in` | Fired server-side after Google OAuth sign-in completes; includes provider and guest link claim status | `app/auth/claim/route.ts` |
| `link_shortened` | Fired when a URL is shortened via the homepage hero form | `app/components/home/HeroShortenForm.tsx` |
| `hero_short_url_copied` | **NEW** — Fired when a user copies the shortened URL result from the homepage hero | `app/components/home/HeroShortenForm.tsx` |
| `link_created` | Fired when a logged-in user creates a short link from the dashboard; includes alias/expiry usage | `app/components/dashboard/CreateLinkCard.tsx` |
| `link_deleted` | Fired when a user deletes a short link from the dashboard | `app/components/dashboard/DashboardClient.tsx` |
| `link_copied` | Fired when a user copies a short link from the dashboard links table | `app/components/dashboard/DashboardClient.tsx` |
| `pricing_cta_clicked` | **NEW** — Fired when a visitor clicks a pricing plan CTA on the homepage; includes plan, tier, price, cta | `app/components/home/PricingSection.tsx` |
| `upgrade_to_pro_clicked` | Fired when a user clicks Upgrade to Pro / Change Plan on the billing page | `app/components/dashboard/billing/BillingPlanCard.tsx` |
| `billing_portal_opened` | Fired when a user opens the Stripe billing portal | `app/components/dashboard/billing/BillingPlanCard.tsx` |
| `yearly_upgrade_scheduled` | Fired when a monthly Pro user schedules an upgrade to yearly billing | `app/components/dashboard/billing/BillingPlanCard.tsx` |
| `subscription_completed` | **Server-side** — Fired when a Stripe `checkout.session.completed` webhook is processed | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | **Server-side** — Fired when a Stripe `customer.subscription.deleted` webhook is processed | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built a pinned dashboard and 5 insights to monitor user behavior:

- **Dashboard**: [Analytics basics](https://eu.posthog.com/project/156374/dashboard/613134)
- [Daily User Sign-ins](https://eu.posthog.com/project/156374/insights/G9jcii2T) — Daily unique users completing Google sign-in
- [Link Activity: Created, Deleted & Copied](https://eu.posthog.com/project/156374/insights/kujiuXE0) — Core product engagement trend
- [Homepage to Dashboard Conversion Funnel](https://eu.posthog.com/project/156374/insights/iRFalBKC) — Anonymous shorten → sign-in → create link activation funnel
- [Upgrade Conversion Funnel](https://eu.posthog.com/project/156374/insights/ccouTHAR) — Upgrade click → subscription completed (checkout drop-off)
- [Pricing CTA Clicks by Plan](https://eu.posthog.com/project/156374/insights/7TuFlBPA) — Homepage pricing intent by plan tier

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
