import type { Dictionary } from "@/lib/dictionaries";
import type { Settings } from "@/lib/settings";
import { Messenger, Phone, Zalo } from "./Icons";

export default function FloatingContact({ dict, settings }: { dict: Dictionary; settings: Settings }) {
  const items = [
    settings.zalo && { href: `https://zalo.me/${settings.zalo.replace(/\D/g, "")}`, label: dict.float.zalo, Icon: Zalo, cls: "flex bg-[#0068ff] text-white" },
    settings.messenger && { href: settings.messenger, label: dict.float.messenger, Icon: Messenger, cls: "hidden md:flex bg-fg text-ink" },
    settings.phone && { href: `tel:${settings.phone}`, label: dict.float.call, Icon: Phone, cls: "flex bg-accent text-ink" },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Phone; cls: string }[];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 md:bottom-6 md:right-6">
      {items.map(({ href, label, Icon, cls }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("tel:") ? undefined : "_blank"}
          rel="noopener"
          aria-label={label}
          className={`group relative h-11 w-11 items-center justify-center md:h-12 md:w-12 rounded-full shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-110 ${cls}`}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-raise px-3 py-1.5 text-xs text-fg opacity-0 transition-opacity group-hover:opacity-100">
            {label}
          </span>
        </a>
      ))}
    </div>
  );
}
