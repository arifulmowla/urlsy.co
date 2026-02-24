import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "X", href: "https://x.com/urlsycc" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/urlsy" },
];

export function PublicFooter() {
  return (
    <footer className="mt-8 rounded-[28px] border border-[var(--stroke)] bg-white px-5 py-6 shadow-[var(--shadow-soft)] sm:px-7">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Legal
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Link className="focus-ring hover:text-[var(--text-muted)]" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="focus-ring hover:text-[var(--text-muted)]" href="/terms">
              Terms and Conditions
            </Link>
            <Link className="focus-ring hover:text-[var(--text-muted)]" href="/cookies">
              Cookie Policy
            </Link>
            <Link className="focus-ring hover:text-[var(--text-muted)]" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Contact
          </p>
          <Link
            className="mt-3 inline-flex text-sm font-semibold text-[var(--text-primary)] underline underline-offset-4"
            href="mailto:support@urlsy.cc"
          >
            support@urlsy.cc
          </Link>
          <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-[var(--text-muted)]">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                className="focus-ring hover:text-[var(--text-primary)]"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Apps
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Coming soon</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="opacity-80">
              <Image
                alt="App Store badge"
                height={40}
                src="/badges/app-store-badge.svg"
                width={140}
              />
            </div>
            <div className="opacity-80">
              <Image
                alt="Google Play badge"
                height={40}
                src="/badges/google-play-badge.svg"
                width={140}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
