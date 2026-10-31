import { getSettings, settingLabels, type SettingKey } from "@/lib/settings";
import { ImageField, inputCls } from "@/components/admin/Fields";
import { saveSettings } from "../../actions";
import { Flash, PageTitle } from "../ui";

export const metadata = { title: "Cài đặt" };

const groups: { title: string; keys: SettingKey[] }[] = [
  { title: "Liên hệ", keys: ["phone", "email", "zalo", "messenger", "addressVi", "addressEn"] },
  { title: "Mạng xã hội", keys: ["facebook", "youtube", "instagram", "tiktok"] },
  { title: "Trang chủ", keys: ["heroImage", "heroVideo", "showreelUrl", "showreelImage"] },
];
const images: SettingKey[] = ["heroImage", "showreelImage"];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const settings = await getSettings();
  const sp = await searchParams;
  return (
    <div className="max-w-4xl">
      <PageTitle title="Cài đặt website" />
      <Flash params={sp} />
      <form action={saveSettings} className="space-y-8">
        {groups.map((g) => (
          <fieldset key={g.title} className="rounded-lg border border-line bg-surface p-6">
            <legend className="px-2 font-semibold">{g.title}</legend>
            <div className="grid gap-5 md:grid-cols-2">
              {g.keys.map((k) => (
                <div key={k} className={images.includes(k) ? "md:col-span-2" : ""}>
                  <label className="mb-2 block text-sm text-fg/85" htmlFor={images.includes(k) ? undefined : k}>
                    {settingLabels[k]}
                  </label>
                  {images.includes(k) ? (
                    <ImageField name={k} defaultValue={settings[k]} />
                  ) : k === "heroVideo" ? (
                    <>
                      <ImageField name={k} defaultValue={settings[k]} accept="video/mp4,video/webm" />
                      <p className="mt-1.5 text-xs text-muted">Video ngắn 10–20 giây, không tiếng, dưới 15MB để tải nhanh.</p>
                    </>
                  ) : (
                    <input id={k} name={k} defaultValue={settings[k]} className={inputCls} />
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        ))}
        <button type="submit" className="rounded-md bg-accent px-6 py-2.5 font-semibold text-ink">
          Lưu cài đặt
        </button>
      </form>
    </div>
  );
}
