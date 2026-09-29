import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { GlobeIcon, InstagramIcon, SendIcon, YouTubeIcon } from "@/components/icons";
import { CONTACT, CONTACT_LINKS } from "@/config/contact";
import type { Messages } from "@/lib/i18n/config";

const CONTACT_ICONS = { website: GlobeIcon, instagram: InstagramIcon, youtube: YouTubeIcon, telegram: SendIcon } as const;
type SocialChannel = keyof typeof CONTACT_ICONS;

function socialChannels(): SocialChannel[] {
  return (Object.keys(CONTACT_ICONS) as SocialChannel[]).filter((k) => CONTACT[k]);
}

const PRODUCT_LINKS = [
  { key: "courses", href: "/courses" },
  { key: "bookstore", href: "/bookstore" },
  { key: "aiHub", href: "/ai-hub" },
  { key: "planner", href: "/planner" },
  { key: "koreaLife", href: "/korea-life" },
] as const;

/** Dark, categorized footer: brand + tagline, product links, and real contact channels — replaces the old one-line footer. */
export function SiteFooter({ m }: { m: Messages }) {
  const t = m.marketing;
  const socials = socialChannels();

  return (
    <footer className="relative mt-16 bg-ink text-cream">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <span className="inline-flex items-center gap-2.5" dir="ltr">
            <LogoMark size={32} />
            <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold tracking-tight text-cream">
              KoreaFarsi
            </span>
          </span>
          <p className="mt-3 max-w-xs text-sm leading-6 text-cream/65">{t.hero.subtitle}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-cream/50 uppercase">{t.features.title}</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {PRODUCT_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className="text-sm text-cream/80 transition hover:text-cream">
                  {t.features.items[key].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-cream/50 uppercase">{t.nav.start}</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            <li>
              <Link href="/auth/welcome" className="text-sm text-cream/80 transition hover:text-cream">
                {t.hero.cta}
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="text-sm text-cream/80 transition hover:text-cream">
                {t.nav.login}
              </Link>
            </li>
          </ul>

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              {socials.map((k) => {
                const Icon = CONTACT_ICONS[k];
                return (
                  <a
                    key={k}
                    href={CONTACT_LINKS[k](CONTACT[k])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-full bg-cream/10 text-cream/80 transition hover:bg-cream/20 hover:text-cream"
                  >
                    <Icon width={16} height={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} KoreaFarsi — {t.footer.rights}
      </div>
    </footer>
  );
}
