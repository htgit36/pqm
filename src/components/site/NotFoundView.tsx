import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary } from "@/lib/dictionaries";
import { href } from "@/lib/i18n";
import { ArrowLeft } from "./Icons";

export default async function NotFoundView() {
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "vi";
  const dict = getDictionary(locale);
  return (
    <section className="container-x flex min-h-[100svh] flex-col justify-center py-32">
      <p className="eyebrow flex items-center gap-2">
        <span className="h-2 w-2 animate-blink rounded-full bg-rec" /> 404 · No signal
      </p>
      <h1 className="display mt-6 text-[clamp(4rem,16vw,16rem)]">404</h1>
      <p className="mt-6 max-w-md text-xl text-fg/80">{dict.pages.notFound}</p>
      <p className="mt-2 max-w-md text-fg/60">{dict.pages.notFoundBody}</p>
      <Link href={href(locale, "home")} className="btn btn-ghost mt-10 self-start">
        <ArrowLeft className="h-4 w-4" /> {dict.nav.home}
      </Link>
    </section>
  );
}
