import Link from "next/link";
import { href, type Locale, type RouteKey } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import type { Settings } from "@/lib/settings";
import { phoneDisplay } from "@/lib/utils";
import { Facebook, Instagram, Tiktok, Youtube } from "./Icons";
import BackToTop from "./BackToTop";
import Logo from "./Logo";

export default function Footer({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: Settings }) {
  const year = new Date().getFullYear();
  const socials = [
    { url: settings.facebook, label: "Facebook", Icon: Facebook },
    { url: settings.youtube, label: "YouTube", Icon: Youtube },
    { url: settings.instagram, label: "Instagram", Icon: Instagram },
    { url: settings.tiktok, label: "TikTok", Icon: Tiktok },
  ].filter((s) => s.url);
  const links: RouteKey[] = ["services", "gallery", "about", "news", "contact"];

  return (
    <footer className="theme-dark relative overflow-hidden bg-ink pt-20 md:pt-28">
      <div className="container-x">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="light" className="mb-10 h-20 md:h-24" />
            <p className="eyebrow mb-6">{dict.home.ctaEyebrow}</p>
            <a href={`tel:${settings.phone}`} className="display block text-[clamp(2rem,4.5vw,4rem)] transition-colors hover:text-accent">
              {phoneDisplay(settings.phone)}
            </a>
            <a href={`mailto:${settings.email}`} className="link-u mt-4 inline-block text-lg text-fg/80 hover:text-fg">
              {settings.email}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="eyebrow mb-5">Menu</p>
              <ul className="space-y-3">
                {links.map((k) => (
                  <li key={k}>
                    <Link href={href(locale, k)} className="link-u text-fg/80 hover:text-fg">
                      {dict.nav[k as keyof Dictionary["nav"]]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">{dict.contact.network}</p>
              <ul className="space-y-3">
                {["phuquocmedia.vn", "chupanhphuquoc.vn", "quayphimphuquoc.vn"].map((d) => (
                  <li key={d}>
                    <a href={`https://${d}`} className="link-u text-fg/80 hover:text-fg" target={d === "phuquocmedia.vn" ? undefined : "_blank"} rel="noopener">
                      {d}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow mb-5">{dict.contact.office}</p>
              <address className="not-italic leading-relaxed text-fg/80">{locale === "en" ? settings.addressEn : settings.addressVi}</address>
              {socials.length > 0 && (
                <div className="mt-6 flex gap-2">
                  {socials.map(({ url, label, Icon }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg/80 transition-colors hover:border-accent hover:text-accent"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © 2017–{year} {dict.footer.company}. {dict.footer.rights}
          </p>
          <p className="flex items-center gap-6">
            <BackToTop label={dict.footer.backToTop} />
          </p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="display translate-y-[18%] whitespace-nowrap text-center text-[14.5vw] leading-none text-fg/[0.06]">Phú Quốc Media</p>
      </div>
    </footer>
  );
}
