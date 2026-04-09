import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { label: "X", href: "https://x.com/urlsycc" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/urlsy" },
];

export function PublicFooter() {
  return (
    <section className="mt-10 border-4 border-[var(--stroke)] bg-black px-5 pb-12 pt-16 shadow-[4px_4px_0_0_#111] sm:px-8 sm:pb-14 sm:pt-20">
      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-5">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Product</p>
          <div className="mt-4 flex flex-col gap-3 text-lg font-bold text-white">
            <Link className="focus-ring hover:text-white/75" href="/features/branded-links">
              Branded Links
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/features/link-analytics">
              Link Analytics
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/features/qr-codes">
              QR Codes
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/features/custom-domains">
              Custom Domains
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/use-cases">
              Use Cases
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Resources</p>
          <div className="mt-4 flex flex-col gap-3 text-lg font-bold text-white">
            <Link className="focus-ring hover:text-white/75" href="/compare">
              Compare
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/compare/bitly-alternative">
              Bitly Alternative
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/blog">
              Blog
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/blog/best-bitly-alternatives-for-marketers">
              Best Bitly Alternatives
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Legal</p>
          <div className="mt-4 flex flex-col gap-3 text-lg font-bold text-white">
            <Link className="focus-ring hover:text-white/75" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/terms">
              Terms and Conditions
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/cookies">
              Cookie Policy
            </Link>
            <Link className="focus-ring hover:text-white/75" href="/contact">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Contact</p>
          <Link
            className="focus-ring mt-4 inline-flex text-lg font-bold text-white underline underline-offset-4"
            href="mailto:support@urlsy.cc"
          >
            support@urlsy.cc
          </Link>
          <div className="mt-6 flex items-center gap-6 text-lg font-bold text-white/80">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                className="focus-ring hover:text-white"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white">Apps</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-white/30">Coming soon</p>
          <div className="mt-3 grid gap-3">
            <div className="rounded-none border-2 border-white/20 bg-[#333] p-2">
              <Image
                alt="App Store badge"
                height={40}
                src="/badges/app-store-badge.svg"
                width={140}
              />
            </div>
            <div className="rounded-none border-2 border-white/20 bg-[#333] p-2">
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

      <div className="mt-12 flex flex-col items-end gap-5 border-t-4 border-white/10 pt-10">
        <div className="border-4 border-white bg-black px-7 py-3 text-5xl font-black uppercase tracking-[-0.04em] text-white">
          URLSY.CC
        </div>
        <p className="text-right text-xs font-bold uppercase tracking-[0.25em] text-white/30">
          © 2026 URLSY.CC
          <br />
          ALL RIGHTS RESERVED
        </p>
      </div>
    </section>
  );
}
