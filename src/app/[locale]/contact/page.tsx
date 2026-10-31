import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, PageHeader } from "@/components/site/Blocks";
import ContactForm from "@/components/site/ContactForm";
import { Mail, Phone, Pin } from "@/components/site/Icons";
import { getServices } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, tr, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { phoneDisplay } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: locale === "en" ? "Contact & quote — Phu Quoc photography and film" : "Liên hệ & báo giá chụp ảnh, quay phim tại Phú Quốc",
    description: dict.pages.contactLead,
    alternates: { canonical: href(locale, "contact"), languages: { vi: href("vi", "contact"), en: href("en", "contact") } },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const address = locale === "en" ? settings.addressEn : settings.addressVi;

  const info = [
    { Icon: Phone, label: dict.contact.phone, value: phoneDisplay(settings.phone), href: `tel:${settings.phone}` },
    { Icon: Mail, label: dict.contact.email, value: settings.email, href: `mailto:${settings.email}` },
    { Icon: Pin, label: dict.contact.office, value: address, href: settings.mapLink },
  ];

  return (
    <>
      <PageHeader eyebrow={dict.home.ctaEyebrow} title={dict.pages.contactTitle} lead={dict.pages.contactLead} />
      <section className="container-x grid gap-16 pb-28 md:grid-cols-12 md:pb-40">
        <div className="md:col-span-4">
          <Reveal as="ul" className="space-y-8">
            {info.map(({ Icon, label, value, href: link }) => (
              <li key={label} data-stagger>
                <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="eyebrow block">{label}</span>
                    <span className="mt-1 block text-lg leading-snug group-hover:text-accent">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-12 border-t border-line pt-8">
            <p className="eyebrow">{dict.contact.hours}</p>
            <p className="mt-2 text-lg">{dict.contact.hoursValue}</p>
          </Reveal>
        </div>
        <Reveal className="relative md:col-span-7 md:col-start-6">
          <Eyebrow>{dict.nav.quote}</Eyebrow>
          <div className="mt-10">
            <ContactForm locale={locale} f={dict.contact.form} services={services.map((s) => tr(s, "title", locale))} />
          </div>
        </Reveal>
      </section>
      <section className="container-x pb-28 md:pb-40">
        <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-line md:aspect-[21/8]">
          <iframe
            title="Google Maps"
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapCoords)}&z=16&hl=${locale}&output=embed`}
          />
        </div>
      </section>
    </>
  );
}
